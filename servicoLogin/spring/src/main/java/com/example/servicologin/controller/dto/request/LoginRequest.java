package com.example.servicologin.controller.dto.request;

public record LoginRequest(
        String email,
        String senha
) {
}
