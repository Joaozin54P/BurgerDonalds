package com.example.servicocardapio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.example.servicocardapio.entity.Adicional;
import com.example.servicocardapio.repository.adapter.CardapioRepositoryAdapter;
import com.example.servicocardapio.repository.jpa.AdicionalRepositoryWithJpa;

@Repository
public class AdicionalRepositoryImpl implements AdicionalRepository {

    private final AdicionalRepositoryWithJpa repository;

    public AdicionalRepositoryImpl(AdicionalRepositoryWithJpa repository) {
        this.repository = repository;
    }

    @Override
    public Adicional salvar(Adicional adicional) {
        return CardapioRepositoryAdapter.castOrm(
                repository.save(CardapioRepositoryAdapter.castEntity(adicional)));
    }

    @Override
    public List<Adicional> listarTodos() {
        return repository.findAll().stream().map(CardapioRepositoryAdapter::castOrm).toList();
    }

    @Override
    public Optional<Adicional> buscarPorId(Long id) {
        return repository.findById(id).map(CardapioRepositoryAdapter::castOrm);
    }

    @Override
    public void deletarPorId(Long id) {
        repository.deleteById(id);
    }
}
