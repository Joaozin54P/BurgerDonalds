package com.example.servicologin.controller.dto.response;

// nunca devolve a senha
public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String perfil
) {
}
