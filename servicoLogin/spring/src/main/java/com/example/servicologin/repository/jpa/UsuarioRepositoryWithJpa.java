package com.example.servicologin.repository.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.servicologin.repository.orm.UsuarioOrm;

public interface UsuarioRepositoryWithJpa extends JpaRepository<UsuarioOrm, Long> {

    Optional<UsuarioOrm> findByEmail(String email);

    boolean existsByEmail(String email);
}
