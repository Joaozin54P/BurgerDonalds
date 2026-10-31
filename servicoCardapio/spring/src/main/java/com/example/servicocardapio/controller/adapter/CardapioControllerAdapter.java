package com.example.servicocardapio.controller.adapter;

import com.example.servicocardapio.controller.dto.request.AdicionalRequest;
import com.example.servicocardapio.controller.dto.request.CategoriaRequest;
import com.example.servicocardapio.controller.dto.request.ProdutoRequest;
import com.example.servicocardapio.controller.dto.response.AdicionalResponse;
import com.example.servicocardapio.controller.dto.response.CategoriaResponse;
import com.example.servicocardapio.controller.dto.response.ProdutoResponse;
import com.example.servicocardapio.entity.Adicional;
import com.example.servicocardapio.entity.Categoria;
import com.example.servicocardapio.entity.Produto;

public class CardapioControllerAdapter {

    private CardapioControllerAdapter() {
    }

    public static Categoria castRequest(CategoriaRequest request) {
        return new Categoria(null, request.nome());
    }

    public static Produto castRequest(ProdutoRequest request) {
        return new Produto(null, request.categoriaId(), request.nome(), request.descricao(),
                request.preco(), request.imagemUrl(), request.disponivel());
    }

    public static Adicional castRequest(AdicionalRequest request) {
        return new Adicional(null, request.nome(), request.preco(), request.disponivel());
    }

    public static CategoriaResponse castResponse(Categoria categoria) {
        return new CategoriaResponse(categoria.id(), categoria.nome());
    }

    public static ProdutoResponse castResponse(Produto produto) {
        return new ProdutoResponse(produto.id(), produto.categoriaId(), produto.nome(), produto.descricao(),
                produto.preco(), produto.imagemUrl(), produto.disponivel());
    }

    public static AdicionalResponse castResponse(Adicional adicional) {
        return new AdicionalResponse(adicional.id(), adicional.nome(), adicional.preco(), adicional.disponivel());
    }
}
