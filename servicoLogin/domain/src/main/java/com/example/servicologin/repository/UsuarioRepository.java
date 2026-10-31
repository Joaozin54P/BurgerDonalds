package com.example.servicologin.repository;

import java.util.Optional;

import com.example.servicologin.entity.Usuario;

public interface UsuarioRepository {
    Usuario salvar(Usuario usuario);

    Optional<Usuario> buscarPorEmail(String email);

    boolean existePorEmail(String email);
}
