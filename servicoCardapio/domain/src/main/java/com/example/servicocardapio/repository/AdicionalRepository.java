package com.example.servicocardapio.repository;

import java.util.List;
import java.util.Optional;

import com.example.servicocardapio.entity.Adicional;

public interface AdicionalRepository {
    Adicional salvar(Adicional adicional);

    List<Adicional> listarTodos();

    Optional<Adicional> buscarPorId(Long id);

    void deletarPorId(Long id);
}
