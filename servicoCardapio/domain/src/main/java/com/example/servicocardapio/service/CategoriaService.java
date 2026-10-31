package com.example.servicocardapio.service;

import java.util.List;

import com.example.servicocardapio.entity.Categoria;
import com.example.servicocardapio.exception.NaoEncontradoException;
import com.example.servicocardapio.exception.RegraDeNegocioException;
import com.example.servicocardapio.repository.CategoriaRepository;
import com.example.servicocardapio.repository.ProdutoRepository;

public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProdutoRepository produtoRepository;

    public CategoriaService(CategoriaRepository categoriaRepository, ProdutoRepository produtoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.produtoRepository = produtoRepository;
    }

    public Categoria criar(Categoria categoria) {
        validar(categoria);
        return categoriaRepository.salvar(new Categoria(null, categoria.nome().trim()));
    }

    public List<Categoria> listarTodas() {
        return categoriaRepository.listarTodas();
    }

    public Categoria buscarPorId(Long id) {
        return categoriaRepository.buscarPorId(id)
                .orElseThrow(() -> new NaoEncontradoException("Categoria nao encontrada"));
    }

    public Categoria atualizar(Long id, Categoria dadosNovos) {
        buscarPorId(id);
        validar(dadosNovos);
        return categoriaRepository.salvar(new Categoria(id, dadosNovos.nome().trim()));
    }

    public void deletar(Long id) {
        buscarPorId(id);
        if (produtoRepository.existePorCategoriaId(id)) {
            throw new RegraDeNegocioException("Nao da para apagar: existem produtos nessa categoria");
        }
        categoriaRepository.deletarPorId(id);
    }

    private void validar(Categoria categoria) {
        if (categoria.nome() == null || categoria.nome().isBlank()) {
            throw new RegraDeNegocioException("O nome da categoria e obrigatorio");
        }
    }
}
