package com.example.servicocardapio.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.servicocardapio.controller.adapter.CardapioControllerAdapter;
import com.example.servicocardapio.controller.dto.request.DisponibilidadeRequest;
import com.example.servicocardapio.controller.dto.request.ProdutoRequest;
import com.example.servicocardapio.controller.dto.response.ProdutoResponse;
import com.example.servicocardapio.exception.RegraDeNegocioException;
import com.example.servicocardapio.service.ProdutoService;

// GET e publico (o servicoPedido tambem usa para consultar preco); o resto so ADMIN
@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProdutoResponse criar(@RequestBody ProdutoRequest request) {
        return CardapioControllerAdapter.castResponse(
                produtoService.criar(CardapioControllerAdapter.castRequest(request)));
    }

    // GET /produtos ou GET /produtos?categoriaId=1
    @GetMapping
    public List<ProdutoResponse> listar(
            @RequestParam(name = "categoriaId", required = false) Long categoriaId) {
        return produtoService.listar(categoriaId).stream()
                .map(CardapioControllerAdapter::castResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ProdutoResponse buscarPorId(@PathVariable("id") Long id) {
        return CardapioControllerAdapter.castResponse(produtoService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ProdutoResponse atualizar(
            @PathVariable("id") Long id,
            @RequestBody ProdutoRequest request) {
        return CardapioControllerAdapter.castResponse(
                produtoService.atualizar(id, CardapioControllerAdapter.castRequest(request)));
    }

    // PATCH /produtos/1/disponibilidade {"disponivel": false}
    @PatchMapping("/{id}/disponibilidade")
    public ProdutoResponse alterarDisponibilidade(
            @PathVariable("id") Long id,
            @RequestBody DisponibilidadeRequest request) {
        if (request.disponivel() == null) {
            throw new RegraDeNegocioException("Informe disponivel: true ou false");
        }
        return CardapioControllerAdapter.castResponse(
                produtoService.alterarDisponibilidade(id, request.disponivel()));
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable("id") Long id) {
        produtoService.deletar(id);
    }
}