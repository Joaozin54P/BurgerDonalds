package com.example.servicologin.security;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

// Monta o cookie que carrega o JWT.
//   HttpOnly ....... JavaScript do navegador NAO le o cookie (um XSS nao consegue roubar o token)
//   SameSite=Lax ... outro site nao consegue mandar o cookie em POST/PUT/DELETE (protege de CSRF)
//   Secure ......... so trafega em HTTPS (ligar em producao: app.cookie.secure=true)
//   Max-Age ........ mesma duracao do token
@Component
public class TokenCookie {

    private final String nome;
    private final boolean secure;
    private final String sameSite;
    private final Duration duracao;

    public TokenCookie(@Value("${app.cookie.name:token}") String nome,
                       @Value("${app.cookie.secure:false}") boolean secure,
                       @Value("${app.cookie.same-site:Lax}") String sameSite,
                       @Value("${app.jwt.expiration-ms}") long expiracaoMs) {
        this.nome = nome;
        this.secure = secure;
        this.sameSite = sameSite;
        this.duracao = Duration.ofMillis(expiracaoMs);
    }

    public ResponseCookie criar(String token) {
        return base(token).maxAge(duracao).build();
    }

    // logout: o navegador apaga o cookie (HttpOnly so pode ser apagado pelo servidor)
    public ResponseCookie apagar() {
        return base("").maxAge(Duration.ZERO).build();
    }

    private ResponseCookie.ResponseCookieBuilder base(String valor) {
        return ResponseCookie.from(nome, valor)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/");
    }
}
