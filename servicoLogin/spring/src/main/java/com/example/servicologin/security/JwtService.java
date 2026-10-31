package com.example.servicologin.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.servicologin.entity.Perfil;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

// emite o token (porta TokenEmissor do domain). Quem VALIDA o token e o gateway (mesmo segredo).
// O perfil vai dentro do token (claim "role"): o gateway descobre se o usuario
// e CLIENTE, COZINHA ou ADMIN sem precisar perguntar para o servicoLogin.
@Component
public class JwtService implements TokenEmissor {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    @Override
    public String emitir(Long id, String email, String nome, Perfil perfil) {
        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(String.valueOf(id))
                .claim("email", email)
                .claim("role", perfil.name())
                .claim("nome", nome)
                .issuedAt(agora)
                .expiration(expiracao)
                .signWith(getSigningKey())
                .compact();
    }
}
