package com.example.servicocardapio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.example.servicocardapio.entity.Produto;
import com.example.servicocardapio.repository.adapter.CardapioRepositoryAdapter;
import com.example.servicocardapio.repository.jpa.ProdutoRepositoryWithJpa;

@Repository
public class ProdutoRepositoryImpl implements ProdutoRepository {

    private final ProdutoRepositoryWithJpa repository;

    public ProdutoRepositoryImpl(ProdutoRepositoryWithJpa repository) {
        this.repository = repository;
    }

    @Override
    public Produto salvar(Produto produto) {
        return CardapioRepositoryAdapter.castOrm(
                repository.save(CardapioRepositoryAdapter.castEntity(produto)));
    }

    @Override
    public List<Produto> listarTodos() {
        return repository.findAll().stream().map(CardapioRepositoryAdapter::castOrm).toList();
    }

    @Override
    public List<Produto> listarPorCategoria(Long categoriaId) {
        return repository.findByCategoriaId(categoriaId).stream().map(CardapioRepositoryAdapter::castOrm).toList();
    }

    @Override
    public Optional<Produto> buscarPorId(Long id) {
        return repository.findById(id).map(CardapioRepositoryAdapter::castOrm);
    }

    @Override
    public boolean existePorCategoriaId(Long categoriaId) {
        return repository.existsByCategoriaId(categoriaId);
    }

    @Override
    public void deletarPorId(Long id) {
        repository.deleteById(id);
    }
}
