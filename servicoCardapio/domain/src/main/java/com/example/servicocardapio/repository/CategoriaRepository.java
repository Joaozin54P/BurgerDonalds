package com.example.servicocardapio.repository;

import java.util.List;
import java.util.Optional;

import com.example.servicocardapio.entity.Categoria;

public interface CategoriaRepository {
    Categoria salvar(Categoria categoria);

    List<Categoria> listarTodas();

    Optional<Categoria> buscarPorId(Long id);

    void deletarPorId(Long id);
}
