package com.example.servicologin.repository.adapter;

import com.example.servicologin.entity.Usuario;
import com.example.servicologin.repository.orm.UsuarioOrm;

public class UsuarioRepositoryAdapter {

    private UsuarioRepositoryAdapter() {
    }

    public static Usuario castOrm(UsuarioOrm orm) {
        return new Usuario(
                orm.getId(),
                orm.getNome(),
                orm.getEmail(),
                orm.getSenha(),
                orm.getPerfil());
    }

    public static UsuarioOrm castEntity(Usuario entity) {
        return new UsuarioOrm(
                entity.id(),
                entity.nome(),
                entity.email(),
                entity.senha(),
                entity.perfil());
    }
}
