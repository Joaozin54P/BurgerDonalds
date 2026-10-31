package com.example.gateway.security;

import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

// o gateway so VALIDA o token (quem emite e o servicoLogin, com o mesmo segredo).
// Assinatura errada, token vencido ou "sub" que nao e um numero => token recusado.
@Component
public class JwtService {

    private final SecretKey chave;

    public JwtService(@Value("${app.jwt.secret}") String segredo) {
        this.chave = Keys.hmacShaKeyFor(segredo.getBytes());
    }

    public Optional<UsuarioToken> ler(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(chave)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            Long id = Long.valueOf(claims.getSubject());
            return Optional.of(new UsuarioToken(id, claims.get("role", String.class)));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
