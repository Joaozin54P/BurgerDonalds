package com.example.servicocardapio.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.servicocardapio.repository.orm.CategoriaOrm;

public interface CategoriaRepositoryWithJpa extends JpaRepository<CategoriaOrm, Long> {
}
