package com.example.servicologin.controller.dto.request;

public record RegistroRequest(
        String nome,
        String email,
        String senha
) {
}
