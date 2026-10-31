package com.example.servicocardapio.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.servicocardapio.controller.adapter.CardapioControllerAdapter;
import com.example.servicocardapio.controller.dto.request.CategoriaRequest;
import com.example.servicocardapio.controller.dto.response.CategoriaResponse;
import com.example.servicocardapio.service.CategoriaService;

// GET e publico; POST/PUT/DELETE so ADMIN (regra no gateway)
@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoriaResponse criar(@RequestBody CategoriaRequest request) {
        return CardapioControllerAdapter.castResponse(
                categoriaService.criar(CardapioControllerAdapter.castRequest(request)));
    }

    @GetMapping
    public List<CategoriaResponse> listar() {
        return categoriaService.listarTodas().stream()
                .map(CardapioControllerAdapter::castResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public CategoriaResponse buscarPorId(@PathVariable("id") Long id) {
        return CardapioControllerAdapter.castResponse(categoriaService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public CategoriaResponse atualizar(@PathVariable("id") Long id, @RequestBody CategoriaRequest request) {
        return CardapioControllerAdapter.castResponse(
                categoriaService.atualizar(id, CardapioControllerAdapter.castRequest(request)));
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable("id") Long id) {
        categoriaService.deletar(id);
    }
}
