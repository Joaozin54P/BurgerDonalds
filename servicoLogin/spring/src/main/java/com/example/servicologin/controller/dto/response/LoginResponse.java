package com.example.servicologin.controller.dto.response;

// o token NAO vem aqui: ele vai no cookie HttpOnly (header Set-Cookie)
public record LoginResponse(
        String nome,
        String perfil
) {
}
