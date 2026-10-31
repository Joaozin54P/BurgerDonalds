package com.example.servicocardapio.repository;

import java.util.List;
import java.util.Optional;

import com.example.servicocardapio.entity.Produto;

public interface ProdutoRepository {
    Produto salvar(Produto produto);

    List<Produto> listarTodos();

    List<Produto> listarPorCategoria(Long categoriaId);

    Optional<Produto> buscarPorId(Long id);

    boolean existePorCategoriaId(Long categoriaId);

    void deletarPorId(Long id);
}
