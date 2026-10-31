package com.example.servicologin.entity;

public record Usuario(
        Long id,
        String nome,
        String email,
        String senha,
        Perfil perfil
) {
}
