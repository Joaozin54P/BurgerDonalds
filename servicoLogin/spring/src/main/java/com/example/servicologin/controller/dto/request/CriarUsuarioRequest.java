package com.example.servicologin.controller.dto.request;

// usado pelo ADMIN para criar funcionarios: perfil = CLIENTE, COZINHA ou ADMIN
public record CriarUsuarioRequest(
        String nome,
        String email,
        String senha,
        String perfil
) {
}
