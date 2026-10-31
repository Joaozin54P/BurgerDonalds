package com.example.servicocardapio.controller.dto.request;

import java.math.BigDecimal;

public record AdicionalRequest(
        String nome,
        BigDecimal preco,
        Boolean disponivel
) {
}
