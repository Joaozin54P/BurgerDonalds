package com.example.servicocardapio.controller.dto.response;

import java.math.BigDecimal;

public record ProdutoResponse(
        Long id,
        Long categoriaId,
        String nome,
        String descricao,
        BigDecimal preco,
        String imagemUrl,
        Boolean disponivel
) {
}
