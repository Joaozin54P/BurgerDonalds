package com.example.servicologin.entity;

// resultado de um login bem sucedido
public record Sessao(
        String token,
        String nome,
        Perfil perfil
) {
}
