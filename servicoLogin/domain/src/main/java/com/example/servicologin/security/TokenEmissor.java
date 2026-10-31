package com.example.servicologin.security;

import com.example.servicologin.entity.Perfil;

// porta: o dominio pede um token, a camada spring decide que e JWT
public interface TokenEmissor {
    // id vai no "sub" do token: os outros servicos identificam o usuario por ele, nao pelo e-mail
    String emitir(Long id, String email, String nome, Perfil perfil);
}
