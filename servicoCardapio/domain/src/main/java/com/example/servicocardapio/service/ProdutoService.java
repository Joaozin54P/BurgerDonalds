package com.example.servicocardapio.service;

import java.util.List;

import com.example.servicocardapio.entity.Produto;
import com.example.servicocardapio.exception.NaoEncontradoException;
import com.example.servicocardapio.exception.RegraDeNegocioException;
import com.example.servicocardapio.repository.CategoriaRepository;
import com.example.servicocardapio.repository.ProdutoRepository;

public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProdutoService(ProdutoRepository produtoRepository, CategoriaRepository categoriaRepository) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public Produto criar(Produto produto) {
        validar(produto);
        // produto novo ja nasce disponivel, a menos que o admin diga o contrario
        boolean disponivel = produto.disponivel() == null || produto.disponivel();
        return produtoRepository.salvar(copiar(null, produto, disponivel));
    }

    // categoriaId == null lista tudo
    public List<Produto> listar(Long categoriaId) {
        return categoriaId == null
                ? produtoRepository.listarTodos()
                : produtoRepository.listarPorCategoria(categoriaId);
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.buscarPorId(id)
                .orElseThrow(() -> new NaoEncontradoException("Produto nao encontrado"));
    }

    public Produto atualizar(Long id, Produto dadosNovos) {
        buscarPorId(id);
        validar(dadosNovos);
        boolean disponivel = dadosNovos.disponivel() == null || dadosNovos.disponivel();
        return produtoRepository.salvar(copiar(id, dadosNovos, disponivel));
    }

    // "acabou o bacon": tira do cardapio sem apagar o produto
    public Produto alterarDisponibilidade(Long id, boolean disponivel) {
        Produto produto = buscarPorId(id);
        return produtoRepository.salvar(produto.comDisponibilidade(disponivel));
    }

    public void deletar(Long id) {
        buscarPorId(id);
        produtoRepository.deletarPorId(id);
    }

    private Produto copiar(Long id, Produto origem, boolean disponivel) {
        return new Produto(id, origem.categoriaId(), origem.nome().trim(), origem.descricao(),
                origem.preco(), origem.imagemUrl(), disponivel);
    }

    private void validar(Produto produto) {
        if (produto.nome() == null || produto.nome().isBlank()) {
            throw new RegraDeNegocioException("O nome do produto e obrigatorio");
        }
        if (produto.preco() == null || produto.preco().signum() < 0) {
            throw new RegraDeNegocioException("Informe um preco valido (zero ou maior)");
        }
        if (produto.categoriaId() == null || categoriaRepository.buscarPorId(produto.categoriaId()).isEmpty()) {
            throw new RegraDeNegocioException("Categoria nao encontrada");
        }
    }
}
