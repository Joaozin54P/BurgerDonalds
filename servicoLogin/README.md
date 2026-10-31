# servicoLogin

Cadastro e login da lanchonete com **JWT** e perfis `CLIENTE`, `COZINHA` e `ADMIN`. É o único serviço que **emite** o token; os outros só validam.

**Autores:** João Pedro Machado e Giovanna Aparecida

## Tecnologias
Java 21 · Spring Boot 4.1.1 · Spring Security (JWT, BCrypt) · JPA · banco H2 em memória · Maven

## Porta
`8085` (pelo gateway: `http://localhost:8080/auth/**`)

## Estrutura (2 módulos)

```
servicoLogin/
├── pom.xml          projeto (lista os 2 módulos)
├── domain/          REGRAS DE NEGÓCIO: Java puro, sem Spring
│   └── entity/ (Usuario, Perfil, Sessao)  repository/ (interface)  security/ (interfaces)
│       service/AuthService  exception/
└── spring/          tudo que usa o Spring
    └── controller/ (API REST + DTOs)  repository/ (JPA + H2)  security/ (JWT, BCrypt)  config/
```

O `domain` define **o que** precisa existir (interfaces `UsuarioRepository`, `SenhaCodificador`, `TokenEmissor`) e o `spring` define **como** (JPA/H2, BCrypt, JWT). O `spring` depende do `domain`, nunca o contrário, por isso o `AuthService` é testado sem Spring e sem banco.

## Como rodar
Requisitos: JDK 21 e Maven.

```bash
mvn clean install
cd spring
mvn spring-boot:run
```

Na IDE (IntelliJ): abra o `pom.xml` da raiz como projeto, recarregue o Maven e rode `ServicoLoginApplication`.

- Console do H2: http://localhost:8085/h2-console (JDBC URL `jdbc:h2:mem:logindb`, usuário `sa`, senha vazia)
- O banco é em memória: ao reiniciar, os clientes cadastrados somem. O admin e a cozinha são recriados sozinhos.
- Para testar, rode o arquivo `requests.http` no IntelliJ, na ordem.

## Usuários criados automaticamente
| Perfil | E-mail | Senha |
| --- | --- | --- |
| ADMIN | admin@lanchonete.com | admin123 |
| COZINHA | cozinha@lanchonete.com | cozinha123 |

Definidos em `spring/src/main/resources/application.yaml` (`app.admin` e `app.cozinha`). Troque as senhas fora de ambiente de teste.

## Rotas
| Rota | Acesso | Corpo |
| --- | --- | --- |
| `POST /auth/registrar` | público (sempre cria `CLIENTE`) | `{"nome","email","senha"}` |
| `POST /auth/login` | público | `{"email","senha"}` → `{"token","nome","perfil"}` |
| `POST /auth/usuarios` | só `ADMIN` | `{"nome","email","senha","perfil"}` |

Erros: `{"erro": "mensagem"}` com 400 (dados inválidos ou e-mail repetido), 401 (login inválido ou sem token) e 403 (sem permissão).

## O token
O JWT (HS256) vale 2 horas e carrega: `sub` = e-mail, `role` = `CLIENTE` | `COZINHA` | `ADMIN` e `nome`.
Os demais serviços precisam do **mesmo `app.jwt.secret`** para validar e ler o `role`.

## CORS
Origens liberadas em `app.cors.origins`: `localhost:8081` (Expo web), `3000`, `4200` e `5173`.

## Testes
- `domain` (sem Spring, sem banco): `cd domain && mvn test`. Cobre cadastro, e-mail repetido, login e perfis.
- `spring`: `ServicoLoginApplicationTests` verifica se o contexto sobe (usa H2, não precisa de Docker).