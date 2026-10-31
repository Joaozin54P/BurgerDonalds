package com.example.servicocardapio.controller.dto.response;

import java.math.BigDecimal;

public record AdicionalResponse(
        Long id,
        String nome,
        BigDecimal preco,
        Boolean disponivel
) {
}
