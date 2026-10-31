package com.example.servicocardapio.repository.adapter;

import com.example.servicocardapio.entity.Adicional;
import com.example.servicocardapio.entity.Categoria;
import com.example.servicocardapio.entity.Produto;
import com.example.servicocardapio.repository.orm.AdicionalOrm;
import com.example.servicocardapio.repository.orm.CategoriaOrm;
import com.example.servicocardapio.repository.orm.ProdutoOrm;

public class CardapioRepositoryAdapter {

    private CardapioRepositoryAdapter() {
    }

    public static Categoria castOrm(CategoriaOrm orm) {
        return new Categoria(orm.getId(), orm.getNome());
    }

    public static CategoriaOrm castEntity(Categoria entity) {
        return new CategoriaOrm(entity.id(), entity.nome());
    }

    public static Produto castOrm(ProdutoOrm orm) {
        return new Produto(orm.getId(), orm.getCategoriaId(), orm.getNome(), orm.getDescricao(),
                orm.getPreco(), orm.getImagemUrl(), orm.getDisponivel());
    }

    public static ProdutoOrm castEntity(Produto entity) {
        return new ProdutoOrm(entity.id(), entity.categoriaId(), entity.nome(), entity.descricao(),
                entity.preco(), entity.imagemUrl(), entity.disponivel());
    }

    public static Adicional castOrm(AdicionalOrm orm) {
        return new Adicional(orm.getId(), orm.getNome(), orm.getPreco(), orm.getDisponivel());
    }

    public static AdicionalOrm castEntity(Adicional entity) {
        return new AdicionalOrm(entity.id(), entity.nome(), entity.preco(), entity.disponivel());
    }
}
