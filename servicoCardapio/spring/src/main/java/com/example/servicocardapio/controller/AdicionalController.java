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
import com.example.servicocardapio.controller.dto.request.AdicionalRequest;
import com.example.servicocardapio.controller.dto.response.AdicionalResponse;
import com.example.servicocardapio.service.AdicionalService;

@RestController
@RequestMapping("/adicionais")
public class AdicionalController {

    private final AdicionalService adicionalService;

    public AdicionalController(AdicionalService adicionalService) {
        this.adicionalService = adicionalService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AdicionalResponse criar(@RequestBody AdicionalRequest request) {
        return CardapioControllerAdapter.castResponse(
                adicionalService.criar(CardapioControllerAdapter.castRequest(request)));
    }

    @GetMapping
    public List<AdicionalResponse> listar() {
        return adicionalService.listarTodos().stream()
                .map(CardapioControllerAdapter::castResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public AdicionalResponse buscarPorId(@PathVariable("id") Long id) {
        return CardapioControllerAdapter.castResponse(adicionalService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public AdicionalResponse atualizar(@PathVariable("id") Long id, @RequestBody AdicionalRequest request) {
        return CardapioControllerAdapter.castResponse(
                adicionalService.atualizar(id, CardapioControllerAdapter.castRequest(request)));
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable("id") Long id) {
        adicionalService.deletar(id);
    }
}
