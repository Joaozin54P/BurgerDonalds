package com.example.servicologin.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.example.servicologin.entity.Usuario;
import com.example.servicologin.repository.adapter.UsuarioRepositoryAdapter;
import com.example.servicologin.repository.jpa.UsuarioRepositoryWithJpa;
import com.example.servicologin.repository.orm.UsuarioOrm;

@Repository
public class UsuarioRepositoryImpl implements UsuarioRepository {

    private final UsuarioRepositoryWithJpa repository;

    public UsuarioRepositoryImpl(UsuarioRepositoryWithJpa repository) {
        this.repository = repository;
    }

    @Override
    public Usuario salvar(Usuario usuario) {
        UsuarioOrm orm = UsuarioRepositoryAdapter.castEntity(usuario);
        return UsuarioRepositoryAdapter.castOrm(repository.save(orm));
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return repository.findByEmail(email).map(UsuarioRepositoryAdapter::castOrm);
    }

    @Override
    public boolean existePorEmail(String email) {
        return repository.existsByEmail(email);
    }
}
