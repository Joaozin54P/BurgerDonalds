package com.example.servicocardapio.repository.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.servicocardapio.repository.orm.ProdutoOrm;

public interface ProdutoRepositoryWithJpa extends JpaRepository<ProdutoOrm, Long> {

    List<ProdutoOrm> findByCategoriaId(Long categoriaId);

    boolean existsByCategoriaId(Long categoriaId);
}
