package com.example.servicocardapio.entity;

import java.math.BigDecimal;

public record Produto(
        Long id,
        Long categoriaId,
        String nome,
        String descricao,
        BigDecimal preco,
        String imagemUrl,
        Boolean disponivel
) {

    public Produto comDisponibilidade(boolean disponivel) {
        return new Produto(id, categoriaId, nome, descricao, preco, imagemUrl, disponivel);
    }
}
