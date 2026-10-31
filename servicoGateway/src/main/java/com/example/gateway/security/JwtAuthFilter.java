package com.example.gateway.security;

import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;

// Descobre QUEM e o usuario e repassa isso aos servicos internos.
//
//  1) le o token do cookie HttpOnly (ou, como alternativa para Postman/k6, do header Authorization: Bearer)
//  2) valida o token e registra o usuario no Spring Security (as regras do SecurityConfig usam isso)
//  3) repassa a identidade aos servicos por headers: X-User-Id e X-User-Role
//
// Os servicos internos NAO tem seguranca: confiam nesses headers. Por isso o filtro SEMPRE apaga
// qualquer X-User-Id / X-User-Role que o cliente tenha mandado (senao qualquer um se passaria por admin).
//
// Nao e @Component de proposito: so e usado dentro da cadeia do Spring Security (ver SecurityConfig).
public class JwtAuthFilter extends OncePerRequestFilter {

    public static final String HEADER_USUARIO_ID = "X-User-Id";
    public static final String HEADER_USUARIO_PERFIL = "X-User-Role";

    private final JwtService jwtService;
    private final String nomeCookie;

    public JwtAuthFilter(JwtService jwtService, String nomeCookie) {
        this.jwtService = jwtService;
        this.nomeCookie = nomeCookie;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Optional<UsuarioToken> usuario = extrairToken(request).flatMap(jwtService::ler);

        usuario.ifPresent(u -> {
            // "ADMIN" no token vira a authority "ROLE_ADMIN" (o que o hasRole("ADMIN") procura)
            List<GrantedAuthority> authorities = u.perfil() == null
                    ? List.of()
                    : List.of(new SimpleGrantedAuthority("ROLE_" + u.perfil()));

            SecurityContextHolder.getContext().setAuthentication(
                    new UsernamePasswordAuthenticationToken(u.id(), null, authorities));
        });

        filterChain.doFilter(new IdentidadeRequest(request, usuario.orElse(null)), response);
    }

    private Optional<String> extrairToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (nomeCookie.equals(cookie.getName()) && !cookie.getValue().isBlank()) {
                    return Optional.of(cookie.getValue());
                }
            }
        }

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return Optional.of(authHeader.substring(7));
        }
        return Optional.empty();
    }

    // devolve a requisicao SEM os headers de identidade que o cliente mandou
    // e COM os do usuario validado (se houver). O proxy do gateway copia os headers desta requisicao.
    private static final class IdentidadeRequest extends HttpServletRequestWrapper {

        private final String usuarioId;
        private final String usuarioPerfil;

        IdentidadeRequest(HttpServletRequest request, UsuarioToken usuario) {
            super(request);
            this.usuarioId = usuario == null ? null : String.valueOf(usuario.id());
            this.usuarioPerfil = usuario == null ? null : usuario.perfil();
        }

        @Override
        public String getHeader(String name) {
            if (HEADER_USUARIO_ID.equalsIgnoreCase(name)) {
                return usuarioId;
            }
            if (HEADER_USUARIO_PERFIL.equalsIgnoreCase(name)) {
                return usuarioPerfil;
            }
            return super.getHeader(name);
        }

        @Override
        public Enumeration<String> getHeaders(String name) {
            if (HEADER_USUARIO_ID.equalsIgnoreCase(name)) {
                return valor(usuarioId);
            }
            if (HEADER_USUARIO_PERFIL.equalsIgnoreCase(name)) {
                return valor(usuarioPerfil);
            }
            return super.getHeaders(name);
        }

        @Override
        public Enumeration<String> getHeaderNames() {
            List<String> nomes = Collections.list(super.getHeaderNames()).stream()
                    .filter(h -> !HEADER_USUARIO_ID.equalsIgnoreCase(h)
                            && !HEADER_USUARIO_PERFIL.equalsIgnoreCase(h))
                    .collect(java.util.stream.Collectors.toCollection(java.util.ArrayList::new));

            if (usuarioId != null) {
                nomes.add(HEADER_USUARIO_ID);
            }
            if (usuarioPerfil != null) {
                nomes.add(HEADER_USUARIO_PERFIL);
            }
            return Collections.enumeration(nomes);
        }

        private static Enumeration<String> valor(String valor) {
            return valor == null ? Collections.emptyEnumeration() : Collections.enumeration(List.of(valor));
        }
    }
}
