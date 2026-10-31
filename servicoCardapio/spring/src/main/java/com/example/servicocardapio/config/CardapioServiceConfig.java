package com.example.servicocardapio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.servicocardapio.repository.AdicionalRepository;
import com.example.servicocardapio.repository.CategoriaRepository;
import com.example.servicocardapio.repository.ProdutoRepository;
import com.example.servicocardapio.service.AdicionalService;
import com.example.servicocardapio.service.CategoriaService;
import com.example.servicocardapio.service.ProdutoService;

@Configuration
public class CardapioServiceConfig {

    @Bean
    public CategoriaService categoriaService(CategoriaRepository categoriaRepository,
                                             ProdutoRepository produtoRepository) {
        return new CategoriaService(categoriaRepository, produtoRepository);
    }

    @Bean
    public ProdutoService produtoService(ProdutoRepository produtoRepository,
                                         CategoriaRepository categoriaRepository) {
        return new ProdutoService(produtoRepository, categoriaRepository);
    }

    @Bean
    public AdicionalService adicionalService(AdicionalRepository adicionalRepository) {
        return new AdicionalService(adicionalRepository);
    }
}
