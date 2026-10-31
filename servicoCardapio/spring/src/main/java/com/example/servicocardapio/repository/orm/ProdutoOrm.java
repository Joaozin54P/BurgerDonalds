package com.example.servicocardapio.repository.orm;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "produto")
public class ProdutoOrm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long categoriaId;

    private String nome;

    private String descricao;

    private BigDecimal preco;

    private String imagemUrl;

    private Boolean disponivel;

    public ProdutoOrm() {
    }

    public ProdutoOrm(Long id, Long categoriaId, String nome, String descricao,
                      BigDecimal preco, String imagemUrl, Boolean disponivel) {
        this.id = id;
        this.categoriaId = categoriaId;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.imagemUrl = imagemUrl;
        this.disponivel = disponivel;
    }

    public Long getId() {
        return id;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public String getNome() {
        return nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public Boolean getDisponivel() {
        return disponivel;
    }
}
