package com.example.servicocardapio.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.servicocardapio.entity.Adicional;
import com.example.servicocardapio.entity.Categoria;
import com.example.servicocardapio.entity.Produto;
import com.example.servicocardapio.exception.NaoEncontradoException;
import com.example.servicocardapio.exception.RegraDeNegocioException;
import com.example.servicocardapio.repository.AdicionalRepository;
import com.example.servicocardapio.repository.CategoriaRepository;
import com.example.servicocardapio.repository.ProdutoRepository;

// teste do dominio puro: os repositorios sao "falsos" (em memoria), sem Spring e sem banco
class CardapioServiceTest {

    private CategoriaService categorias;
    private ProdutoService produtos;
    private AdicionalService adicionais;

    @BeforeEach
    void preparar() {
        Map<Long, Categoria> bancoCategorias = new LinkedHashMap<>();
        Map<Long, Produto> bancoProdutos = new LinkedHashMap<>();
        Map<Long, Adicional> bancoAdicionais = new LinkedHashMap<>();
        long[] sequencia = {0};

        CategoriaRepository categoriaRepository = new CategoriaRepository() {
            public Categoria salvar(Categoria c) {
                Long id = c.id() != null ? c.id() : ++sequencia[0];
                Categoria salva = new Categoria(id, c.nome());
                bancoCategorias.put(id, salva);
                return salva;
            }

            public List<Categoria> listarTodas() {
                return new ArrayList<>(bancoCategorias.values());
            }

            public Optional<Categoria> buscarPorId(Long id) {
                return Optional.ofNullable(bancoCategorias.get(id));
            }

            public void deletarPorId(Long id) {
                bancoCategorias.remove(id);
            }
        };

        ProdutoRepository produtoRepository = new ProdutoRepository() {
            public Produto salvar(Produto p) {
                Long id = p.id() != null ? p.id() : ++sequencia[0];
                Produto salvo = new Produto(id, p.categoriaId(), p.nome(), p.descricao(), p.preco(),
                        p.imagemUrl(), p.disponivel());
                bancoProdutos.put(id, salvo);
                return salvo;
            }

            public List<Produto> listarTodos() {
                return new ArrayList<>(bancoProdutos.values());
            }

            public List<Produto> listarPorCategoria(Long categoriaId) {
                return bancoProdutos.values().stream().filter(p -> p.categoriaId().equals(categoriaId)).toList();
            }

            public Optional<Produto> buscarPorId(Long id) {
                return Optional.ofNullable(bancoProdutos.get(id));
            }

            public boolean existePorCategoriaId(Long categoriaId) {
                return bancoProdutos.values().stream().anyMatch(p -> p.categoriaId().equals(categoriaId));
            }

            public void deletarPorId(Long id) {
                bancoProdutos.remove(id);
            }
        };

        AdicionalRepository adicionalRepository = new AdicionalRepository() {
            public Adicional salvar(Adicional a) {
                Long id = a.id() != null ? a.id() : ++sequencia[0];
                Adicional salvo = new Adicional(id, a.nome(), a.preco(), a.disponivel());
                bancoAdicionais.put(id, salvo);
                return salvo;
            }

            public List<Adicional> listarTodos() {
                return new ArrayList<>(bancoAdicionais.values());
            }

            public Optional<Adicional> buscarPorId(Long id) {
                return Optional.ofNullable(bancoAdicionais.get(id));
            }

            public void deletarPorId(Long id) {
                bancoAdicionais.remove(id);
            }
        };

        categorias = new CategoriaService(categoriaRepository, produtoRepository);
        produtos = new ProdutoService(produtoRepository, categoriaRepository);
        adicionais = new AdicionalService(adicionalRepository);
    }

    private Produto novoProduto(Long categoriaId, String nome, String preco, Boolean disponivel) {
        return new Produto(null, categoriaId, nome, "descricao", new BigDecimal(preco), null, disponivel);
    }

    @Test
    void categoriaGuardaNomeSemEspacosERecusaNomeVazio() {
        assertEquals("Lanches", categorias.criar(new Categoria(null, "  Lanches ")).nome());
        assertThrows(RegraDeNegocioException.class, () -> categorias.criar(new Categoria(null, " ")));
        assertThrows(RegraDeNegocioException.class, () -> categorias.criar(new Categoria(null, null)));
    }

    @Test
    void produtoNovoNasceDisponivelAMenosQueDigamOContrario() {
        Long lanches = categorias.criar(new Categoria(null, "Lanches")).id();

        assertTrue(produtos.criar(novoProduto(lanches, "Burger", "20.00", null)).disponivel());
        assertEquals(false, produtos.criar(novoProduto(lanches, "Burger Beta", "20.00", false)).disponivel());
    }

    @Test
    void recusaProdutoInvalido() {
        Long lanches = categorias.criar(new Categoria(null, "Lanches")).id();

        assertThrows(RegraDeNegocioException.class, () -> produtos.criar(novoProduto(lanches, "", "10", true)));
        assertThrows(RegraDeNegocioException.class, () -> produtos.criar(novoProduto(lanches, "X", "-1", true)));
        assertThrows(RegraDeNegocioException.class, () -> produtos.criar(novoProduto(99L, "X", "10", true)));
        assertThrows(RegraDeNegocioException.class, () -> produtos.criar(novoProduto(null, "X", "10", true)));
        assertThrows(RegraDeNegocioException.class,
                () -> produtos.criar(new Produto(null, lanches, "X", null, null, null, true)));
    }

    @Test
    void tiraProdutoDoCardapioSemApagar() {
        Long lanches = categorias.criar(new Categoria(null, "Lanches")).id();
        Produto burger = produtos.criar(novoProduto(lanches, "Burger", "20.00", true));

        assertEquals(false, produtos.alterarDisponibilidade(burger.id(), false).disponivel());
        assertEquals(false, produtos.buscarPorId(burger.id()).disponivel());
        assertEquals(true, produtos.alterarDisponibilidade(burger.id(), true).disponivel());
    }

    @Test
    void atualizaProdutoMantendoOId() {
        Long lanches = categorias.criar(new Categoria(null, "Lanches")).id();
        Produto burger = produtos.criar(novoProduto(lanches, "Burger", "20.00", true));

        Produto atualizado = produtos.atualizar(burger.id(), novoProduto(lanches, "Burger Premium", "35.00", true));

        assertEquals(burger.id(), atualizado.id());
        assertEquals("Burger Premium", atualizado.nome());
        assertEquals(0, new BigDecimal("35.00").compareTo(atualizado.preco()));
        assertEquals(1, produtos.listar(null).size());
    }

    @Test
    void filtraProdutosPorCategoria() {
        Long lanches = categorias.criar(new Categoria(null, "Lanches")).id();
        Long bebidas = categorias.criar(new Categoria(null, "Bebidas")).id();
        produtos.criar(novoProduto(lanches, "Burger", "20", true));
        produtos.criar(novoProduto(lanches, "Chicken", "22", true));
        produtos.criar(novoProduto(bebidas, "Suco", "9", true));

        assertEquals(2, produtos.listar(lanches).size());
        assertEquals(1, produtos.listar(bebidas).size());
        assertEquals(3, produtos.listar(null).size());
    }

    @Test
    void naoApagaCategoriaQueAindaTemProdutos() {
        Long lanches = categorias.criar(new Categoria(null, "Lanches")).id();
        Produto burger = produtos.criar(novoProduto(lanches, "Burger", "20", true));

        assertThrows(RegraDeNegocioException.class, () -> categorias.deletar(lanches));

        produtos.deletar(burger.id());
        categorias.deletar(lanches);
        assertTrue(categorias.listarTodas().isEmpty());
    }

    @Test
    void buscarOuApagarInexistenteDaNaoEncontrado() {
        assertThrows(NaoEncontradoException.class, () -> produtos.buscarPorId(999L));
        assertThrows(NaoEncontradoException.class, () -> produtos.deletar(999L));
        assertThrows(NaoEncontradoException.class, () -> categorias.buscarPorId(999L));
        assertThrows(NaoEncontradoException.class, () -> adicionais.buscarPorId(999L));
    }

    @Test
    void adicionalValidaNomeEPrecoENasceDisponivel() {
        Adicional bacon = adicionais.criar(new Adicional(null, " Bacon extra ", new BigDecimal("4.00"), null));

        assertEquals("Bacon extra", bacon.nome());
        assertTrue(bacon.disponivel());
        assertThrows(RegraDeNegocioException.class, () -> adicionais.criar(new Adicional(null, "", BigDecimal.ONE, true)));
        assertThrows(RegraDeNegocioException.class,
                () -> adicionais.criar(new Adicional(null, "Queijo", new BigDecimal("-2"), true)));
    }
}
