package com.example.gateway.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

// TODAS as regras de "quem pode o que" da lanchonete ficam aqui. Os servicos internos
// (login, cardapio, pedido, cozinha) nao tem Spring Security: so recebem o que o gateway deixar passar.
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           JwtService jwtService,
                                           @Value("${app.cookie.name:token}") String nomeCookie) throws Exception {
        http
            // CSRF desligado porque a API e stateless; o cookie e SameSite=Lax (ver servicoLogin),
            // entao outro site nao consegue mandar POST/PUT/DELETE com o cookie do usuario
            .csrf(csrf -> csrf.disable())
            // o CORS e tratado antes de tudo pelo CorsPreflightFilter
            .cors(cors -> cors.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/error", "/actuator/health", "/actuator/info").permitAll()

                // ---- servicoLogin ----
                .requestMatchers(HttpMethod.POST, "/auth/login", "/auth/registrar", "/auth/logout").permitAll()
                .requestMatchers("/auth/usuarios/**").hasRole("ADMIN")

                // ---- servicoCardapio: ler e publico, alterar so ADMIN ----
                .requestMatchers(HttpMethod.GET, "/categorias/**", "/produtos/**", "/adicionais/**").permitAll()
                .requestMatchers("/categorias/**", "/produtos/**", "/adicionais/**").hasRole("ADMIN")

                // ---- servicoPedido: cliente logado cria/consulta os seus; o resto e da equipe ----
                .requestMatchers(HttpMethod.GET, "/pedidos").hasAnyRole("ADMIN", "COZINHA")
                .requestMatchers(HttpMethod.POST, "/pedidos/*/retirar").hasAnyRole("ADMIN", "COZINHA")
                .requestMatchers(HttpMethod.PATCH, "/pedidos/*/status").hasAnyRole("ADMIN", "COZINHA")
                .requestMatchers("/pedidos/**").authenticated()

                // ---- servicoCozinha: so a equipe. Receber pedido "na mao" (POST) e so ADMIN (testes) ----
                .requestMatchers(HttpMethod.POST, "/cozinha/pedidos").hasRole("ADMIN")
                .requestMatchers("/cozinha/**").hasAnyRole("ADMIN", "COZINHA")

                // o que nao esta listado acima nao existe para o mundo externo
                .anyRequest().denyAll()
            )
            // sem login -> 401, logado sem permissao -> 403 (sempre com {"erro": "..."} como os outros servicos)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) ->
                        erro(res, HttpServletResponse.SC_UNAUTHORIZED, "Voce precisa estar logado"))
                .accessDeniedHandler((req, res, e) ->
                        erro(res, HttpServletResponse.SC_FORBIDDEN, "Voce nao tem permissao para esta acao")))
            .addFilterBefore(new JwtAuthFilter(jwtService, nomeCookie), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private static void erro(HttpServletResponse response, int status, String mensagem) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write("{\"erro\":\"" + mensagem + "\"}");
    }
}
