package com.example.servicocardapio.entity;

import java.math.BigDecimal;

// extra que o cliente pode colocar no lanche (bacon extra, queijo extra...)
public record Adicional(
        Long id,
        String nome,
        BigDecimal preco,
        Boolean disponivel
) {
}
