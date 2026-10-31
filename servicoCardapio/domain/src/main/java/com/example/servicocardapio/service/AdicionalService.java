package com.example.servicocardapio.service;

import java.util.List;

import com.example.servicocardapio.entity.Adicional;
import com.example.servicocardapio.exception.NaoEncontradoException;
import com.example.servicocardapio.exception.RegraDeNegocioException;
import com.example.servicocardapio.repository.AdicionalRepository;

public class AdicionalService {

    private final AdicionalRepository adicionalRepository;

    public AdicionalService(AdicionalRepository adicionalRepository) {
        this.adicionalRepository = adicionalRepository;
    }

    public Adicional criar(Adicional adicional) {
        validar(adicional);
        return adicionalRepository.salvar(copiar(null, adicional));
    }

    public List<Adicional> listarTodos() {
        return adicionalRepository.listarTodos();
    }

    public Adicional buscarPorId(Long id) {
        return adicionalRepository.buscarPorId(id)
                .orElseThrow(() -> new NaoEncontradoException("Adicional nao encontrado"));
    }

    public Adicional atualizar(Long id, Adicional dadosNovos) {
        buscarPorId(id);
        validar(dadosNovos);
        return adicionalRepository.salvar(copiar(id, dadosNovos));
    }

    public void deletar(Long id) {
        buscarPorId(id);
        adicionalRepository.deletarPorId(id);
    }

    private Adicional copiar(Long id, Adicional origem) {
        boolean disponivel = origem.disponivel() == null || origem.disponivel();
        return new Adicional(id, origem.nome().trim(), origem.preco(), disponivel);
    }

    private void validar(Adicional adicional) {
        if (adicional.nome() == null || adicional.nome().isBlank()) {
            throw new RegraDeNegocioException("O nome do adicional e obrigatorio");
        }
        if (adicional.preco() == null || adicional.preco().signum() < 0) {
            throw new RegraDeNegocioException("Informe um preco valido (zero ou maior)");
        }
    }
}
