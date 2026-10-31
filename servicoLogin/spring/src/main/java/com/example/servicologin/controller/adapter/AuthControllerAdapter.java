package com.example.servicologin.controller.adapter;

import com.example.servicologin.controller.dto.response.LoginResponse;
import com.example.servicologin.controller.dto.response.UsuarioResponse;
import com.example.servicologin.entity.Perfil;
import com.example.servicologin.entity.Sessao;
import com.example.servicologin.entity.Usuario;
import com.example.servicologin.exception.RegraDeNegocioException;

public class AuthControllerAdapter {

    private AuthControllerAdapter() {
    }

    public static Perfil castPerfil(String perfil) {
        try {
            return Perfil.valueOf(perfil == null ? "" : perfil.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RegraDeNegocioException("Perfil invalido. Use CLIENTE, COZINHA ou ADMIN");
        }
    }

    public static UsuarioResponse castResponse(Usuario usuario) {
        return new UsuarioResponse(usuario.id(), usuario.nome(), usuario.email(), usuario.perfil().name());
    }

    public static LoginResponse castResponse(Sessao sessao) {
        return new LoginResponse(sessao.nome(), sessao.perfil().name());
    }
}
