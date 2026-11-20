package com.example.servicopedido.integration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.example.servicopedido.entity.AdicionalCardapio;
import com.example.servicopedido.entity.ProdutoCardapio;
import com.example.servicopedido.exception.RegraDeNegocioException;
import com.example.servicopedido.exception.ServicoIndisponivelException;
import com.example.servicopedido.integration.dto.AdicionalCardapioResponse;
import com.example.servicopedido.integration.dto.ProdutoCardapioResponse;

// chamada HTTP (sincrona) para o servicoCardapio. Os GETs do cardapio sao publicos,
// entao nao precisa mandar token.
@Component
public class CardapioIntegrationImpl implements CardapioIntegration {

    private static final Logger log = LoggerFactory.getLogger(CardapioIntegrationImpl.class);

    private final RestClient restClient;

    public CardapioIntegrationImpl(@Value("${app.cardapio.url}") String baseUrl) {
        this.restClient = RestClient.create(baseUrl);
    }

    @Override
    @Retryable(
            retryFor = ServicoIndisponivelException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 2000, multiplier = 2.0)
    )
    public ProdutoCardapio buscarProduto(Long produtoId) {
        log.info("Consultando produto #{} no servicoCardapio...", produtoId);
        ProdutoCardapioResponse resposta = buscar("/produtos/{id}", produtoId, ProdutoCardapioResponse.class,
                "Produto " + produtoId + " nao existe no cardapio");

        return new ProdutoCardapio(resposta.id(), resposta.nome(), resposta.preco(),
                Boolean.TRUE.equals(resposta.disponivel()));
    }

    @Recover
    public ProdutoCardapio recuperarBuscarProduto(ServicoIndisponivelException e, Long produtoId) {
        log.error("Falha ao consultar produto #{} no servicoCardapio apos 3 tentativas: {}", produtoId, e.getMessage());
        throw e;
    }

    @Override
    @Retryable(
            retryFor = ServicoIndisponivelException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 2000, multiplier = 2.0)
    )
    public AdicionalCardapio buscarAdicional(Long adicionalId) {
        log.info("Consultando adicional #{} no servicoCardapio...", adicionalId);
        AdicionalCardapioResponse resposta = buscar("/adicionais/{id}", adicionalId, AdicionalCardapioResponse.class,
                "Adicional " + adicionalId + " nao existe no cardapio");

        return new AdicionalCardapio(resposta.id(), resposta.nome(), resposta.preco(),
                Boolean.TRUE.equals(resposta.disponivel()));
    }

    @Recover
    public AdicionalCardapio recuperarBuscarAdicional(ServicoIndisponivelException e, Long adicionalId) {
        log.error("Falha ao consultar adicional #{} no servicoCardapio apos 3 tentativas: {}", adicionalId, e.getMessage());
        throw e;
    }

    private <T> T buscar(String uri, Long id, Class<T> tipo, String mensagemNaoEncontrado) {
        try {
            T resposta = restClient.get().uri(uri, id).retrieve().body(tipo);
            if (resposta == null) {
                throw new RegraDeNegocioException(mensagemNaoEncontrado);
            }
            return resposta;
        } catch (HttpClientErrorException.NotFound e) {
            throw new RegraDeNegocioException(mensagemNaoEncontrado);
        } catch (RestClientException e) {
            throw new ServicoIndisponivelException("O cardapio esta indisponivel no momento, tente novamente");
        }
    }
}