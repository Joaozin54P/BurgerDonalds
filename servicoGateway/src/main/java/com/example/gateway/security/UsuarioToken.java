package com.example.gateway.security;

// o que o gateway le de dentro do JWT: o ID de quem e o usuario e o perfil dele
public record UsuarioToken(
        Long id,
        String perfil
) {
}
