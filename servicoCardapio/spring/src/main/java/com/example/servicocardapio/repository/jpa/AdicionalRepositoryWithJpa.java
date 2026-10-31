package com.example.servicocardapio.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.servicocardapio.repository.orm.AdicionalOrm;

public interface AdicionalRepositoryWithJpa extends JpaRepository<AdicionalOrm, Long> {
}
