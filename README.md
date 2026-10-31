# BurgerDonalds

Sistema de pedidos para lanchonete, feito em **microserviços**, com um app **React Native (Expo)** que roda no celular, no emulador e no navegador.

Atividade da disciplina **Programação Multiplataforma**.

**Autores:** João Pedro Machado e Giovanna Aparecida

## O que o sistema faz

- O **cliente** vê o cardápio, monta o pedido, escolhe a forma de pagamento (simulada), recebe uma **senha de retirada** e acompanha o status até retirar.
- A **cozinha** recebe os pedidos numa fila (Novos, Em preparo, Prontos), começa o preparo, marca como pronto e entrega.
- O **administrador** gerencia produtos, categorias, adicionais e a equipe (usuários da cozinha e outros admins).

Fluxo do pedido: `CRIADO → EM_PREPARO → PRONTO → RETIRADO` (ou `CANCELADO`, só enquanto a cozinha não começou).

## Tecnologias

- **Back-end:** Java 21, Spring Boot 4, Spring Data JPA, H2, Spring Security (JWT), Spring Cloud Gateway (WebMVC), Maven
- **Mensageria:** RabbitMQ (CloudAMQP)
- **Front-end:** React 19, React Native, Expo, react-native-web

## Estrutura do projeto

A pasta principal é a `BurgerDonalds`, e dentro dela ficam os 5 serviços do back-end e o app:

```
BurgerDonalds/
├── servicoGateway/      API Gateway (porta 8080): ponto de entrada, login (JWT) e permissões
├── servicoLogin/        Cadastro, login e usuários (porta 8085)
├── servicoCardapio/     Categorias, produtos e adicionais (porta 8082)
├── servicoPedido/       Pedidos e senha de retirada (porta 8083)
├── servicoCozinha/      Fila de preparo da cozinha (porta 8084)
├── LanchoneteFront/     App React Native / Expo
└── README.md
```

Cada serviço é um projeto separado, com **banco H2 próprio**. O app fala somente com o gateway, e os serviços de pedido e cozinha trocam mensagens pelo RabbitMQ.

### Os microserviços (login, cardápio, pedido e cozinha)

Todos seguem a mesma divisão em dois módulos Maven. Exemplo com o `servicoPedido`:

```
servicoPedido/
├── pom.xml
├── README.md
├── domain/                            REGRAS DE NEGÓCIO: Java puro, sem Spring
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/example/servicopedido/
│       │   ├── entity/                Pedido, ItemPedido, StatusPedido, FormaPagamento...
│       │   ├── service/               CriarPedidoService, CancelarPedidoService...
│       │   ├── repository/            interface PedidoRepository
│       │   ├── integration/           interface do cardápio
│       │   ├── messaging/             interface de publicação de eventos
│       │   ├── event/                 PedidoCriadoEvent, PedidoCanceladoEvent...
│       │   ├── transaction/           interface de transação
│       │   └── exception/             erros de negócio
│       └── test/                      testes das regras (sem Spring, banco ou RabbitMQ)
└── spring/                            TUDO QUE USA O SPRING
    ├── pom.xml
    └── src/
        ├── main/
        │   ├── java/com/example/servicopedido/
        │   │   ├── controller/        API REST, DTOs (request/response) e tratamento de erros
        │   │   ├── repository/        JPA + H2 (orm/, jpa/ e adapter/)
        │   │   ├── integration/       chamada HTTP ao servicoCardapio
        │   │   ├── messaging/         RabbitMQ (ou só log, com a mensageria desligada)
        │   │   ├── transaction/       transações do Spring
        │   │   ├── config/            criação dos beans
        │   │   └── ServicoPedidoApplication.java
        │   └── resources/application.yaml
        └── test/                      testes com Spring, H2 e transações reais
```

O `domain` decide **o que** acontece (calcular total, validar disponibilidade, só avançar o status na ordem certa). O `spring` decide **como** (JPA, HTTP, RabbitMQ).

| Serviço | Pacote base | O que tem de específico |
| --- | --- | --- |
| `servicoLogin` | `com.example.servicologin` | `security/` com `JwtService` e `TokenCookie` (cookie HttpOnly) |
| `servicoCardapio` | `com.example.servicocardapio` | Controllers de produtos, categorias e adicionais; `CardapioInicialConfig` com o cardápio de exemplo |
| `servicoPedido` | `com.example.servicopedido` | `integration/` (consulta o cardápio) e `messaging/` (publica pedido-criado, cancelado e finalizado) |
| `servicoCozinha` | `com.example.servicocozinha` | `messaging/` com os consumidores de pedido-criado e pedido-cancelado e a publicação do status |

### servicoGateway

```
servicoGateway/
├── pom.xml
├── readme.md
├── teste-concorrencia.js              teste de pedidos simultâneos (k6)
└── src/main/
    ├── java/com/example/gateway/
    │   ├── GatewayApplication.java
    │   ├── CorsPreflightFilter.java   CORS para o app web
    │   └── security/
    │       ├── SecurityConfig.java    regras de quem pode o quê
    │       ├── JwtAuthFilter.java     lê o cookie e identifica o usuário
    │       ├── JwtService.java        valida o token
    │       └── UsuarioToken.java
    └── resources/application.yaml     rotas para cada serviço
```

### LanchoneteFront

```
LanchoneteFront/
├── App.js                  raiz: providers, cabeçalho e troca de abas
├── index.js
├── app.json
├── package.json
├── README.md
└── src/
    ├── config.js           endereço do gateway
    ├── theme.js            cores e estilos
    ├── utils.js            funções auxiliares
    ├── services/           chamadas HTTP: api, auth, cardápio, pedido, cozinha, admin
    ├── context/            AuthContext, CarrinhoContext, ToastContext
    ├── hooks/              useCarregar, usePolling, useLayout
    ├── screens/            CardapioScreen, PedidosScreen, CozinhaScreen, AdminScreen
    └── components/
        ├── Header, Logo, AuthSheet, CartSheet, CartContent, ItemSheet, ItensPedido
        ├── ConfirmDialog, ui
        └── admin/          ProdutosAdmin, CategoriasAdmin, AdicionaisAdmin, EquipeAdmin, AdminUi
```

## Perfis e permissões

Toda a regra de "quem pode o quê" fica **só no gateway**. Os serviços internos não têm Spring Security.

| Perfil | O que pode |
| --- | --- |
| Visitante | Ver o cardápio |
| `CLIENTE` | Fazer pedidos, ver e cancelar os próprios pedidos |
| `COZINHA` | Tela da cozinha: iniciar, finalizar e entregar pedidos |
| `ADMIN` | Tudo da cozinha e o painel de gerenciamento |

Usuários de teste (criados quando o servicoLogin sobe):

| Perfil | E-mail | Senha |
| --- | --- | --- |
| ADMIN | admin@lanchonete.com | admin123 |
| COZINHA | cozinha@lanchonete.com | cozinha123 |

Clientes se cadastram pela própria tela de login.

## Documentação de cada projeto

Cada pasta tem o seu próprio `README.md` com as rotas, as regras e exemplos de uso. Os arquivos `requests.http` (servicoLogin e servicoCozinha) servem para testar as APIs.
