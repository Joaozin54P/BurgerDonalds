package com.example.servicocardapio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.example.servicocardapio.entity.Categoria;
import com.example.servicocardapio.repository.adapter.CardapioRepositoryAdapter;
import com.example.servicocardapio.repository.jpa.CategoriaRepositoryWithJpa;

@Repository
public class CategoriaRepositoryImpl implements CategoriaRepository {

    private final CategoriaRepositoryWithJpa repository;

    public CategoriaRepositoryImpl(CategoriaRepositoryWithJpa repository) {
        this.repository = repository;
    }

    @Override
    public Categoria salvar(Categoria categoria) {
        return CardapioRepositoryAdapter.castOrm(
                repository.save(CardapioRepositoryAdapter.castEntity(categoria)));
    }

    @Override
    public List<Categoria> listarTodas() {
        return repository.findAll().stream().map(CardapioRepositoryAdapter::castOrm).toList();
    }

    @Override
    public Optional<Categoria> buscarPorId(Long id) {
        return repository.findById(id).map(CardapioRepositoryAdapter::castOrm);
    }

    @Override
    public void deletarPorId(Long id) {
        repository.deleteById(id);
    }
}
