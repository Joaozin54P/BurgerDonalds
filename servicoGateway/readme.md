# Gateway

Ponto de entrada único das APIs da lanchonete. O app fala **somente** com o gateway, que encaminha cada rota ao serviço certo.

**Autores:** João Pedro Machado e Giovanna Aparecida

## Tecnologias
Java 21 · Spring Boot 4.0.3 · Spring Cloud 2025.1.1 (Gateway Server WebMVC) · Spring Boot Actuator · Maven

## Porta
`8080` (configurável com `GATEWAY_PORT`)

## Rotas
| Rota pública | Serviço de destino | Porta padrão | Variável |
| --- | --- | --- | --- |
| `/auth/**` | servicoLogin | `8085` | `LOGIN_URL` |
| `/categorias/**`, `/produtos/**`, `/adicionais/**` | servicoCardapio | `8082` | `CARDAPIO_URL` |
| `/pedidos/**` | servicoPedido | `8083` | `PEDIDO_URL` |

Todos os headers são repassados, inclusive `Authorization: Bearer ...` e o `Idempotency-Key` exigido pelo `POST /pedidos`.

## Ordem para subir tudo
1. servicoLogin (8085), servicoCardapio (8082) e servicoPedido (8083)
2. gateway (8080)
3. app: `cd front && npx expo start`

## Como rodar
Requisitos: JDK 21 e Maven.

```bash
mvn spring-boot:run
```

Com endereços diferentes:

```bash
LOGIN_URL=http://login:8085 CARDAPIO_URL=http://cardapio:8082 PEDIDO_URL=http://pedido:8083 mvn spring-boot:run
```

Health check: `GET http://localhost:8080/actuator/health`

## Como o app usa o gateway
O app (Expo / React Native, pasta `front/`) usa `API_URL = http://<HOST>:8080`, definido em `front/src/config.js`:

| Onde roda | HOST |
| --- | --- |
| Emulador Android | `10.0.2.2` (padrão) |
| Simulador iOS e web | `localhost` |
| Celular de verdade | IP do PC na mesma rede Wi-Fi |

## CORS
- O app **nativo** (Android/iOS) não usa CORS.
- No app **web** (Expo web em `localhost:8081`, ou React/Angular em `3000`, `4200` e `5173`) o gateway responde o preflight (`OPTIONS`) dessas origens. Nas demais requisições o cabeçalho de CORS vem do serviço de destino, então **cada serviço** precisa ter a origem em `app.cors.origins` (incluindo `http://localhost:8081`).

## Teste de concorrência (k6)
`teste-concorrencia.js` dispara pedidos simultâneos pelo gateway para testar a idempotência.

```bash
k6 run teste-concorrencia.js
```

Variáveis: `BASE_URL` (padrão `http://localhost:8080`), `EMAIL`, `SENHA`, `PRODUTO_ID`, `QTD_REQUISICOES` (padrão 30), `QUANTIDADE`, `MODO`, `IDEMPOTENCY_KEY`.

- `MODO=idempotencia` (padrão): todas as requisições usam a mesma chave e só um pedido deve ser criado (as demais voltam `200`).
- Qualquer outro `MODO`: cada requisição usa chave própria e todas devem criar pedido (`201`).

## Problemas comuns
- **Erro 5xx no app:** algum serviço de destino está fora do ar.
- **"Gateway fora do ar" no app:** o app mostra essa mensagem para qualquer falha de rede. Confira o `HOST` em `front/src/config.js` e, se estiver na web, o CORS dos serviços (principalmente se o `8081` está em `app.cors.origins`).