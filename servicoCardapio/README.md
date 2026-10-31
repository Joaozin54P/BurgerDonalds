# servicoCardapio

Cardápio da lanchonete: **categorias**, **produtos** e **adicionais** (bacon extra, queijo extra...). Leitura pública, escrita só para `ADMIN`.

**Autores:** João Pedro Machado e Giovanna Aparecida

## Tecnologias
Java 21 · Spring Boot 4.1.1 · Spring Security (valida JWT) · JPA · banco H2 em memória · Maven

## Porta
`8082` (pelo gateway: `/categorias/**`, `/produtos/**` e `/adicionais/**` em `http://localhost:8080`)

## Estrutura (2 módulos)

```
servicoCardapio/
├── pom.xml          projeto (lista os 2 módulos)
├── domain/          REGRAS DE NEGÓCIO: Java puro, sem Spring
│   └── entity/ (Categoria, Produto, Adicional)  repository/ (interfaces)
│       service/ (CategoriaService, ProdutoService, AdicionalService)  exception/
└── spring/          tudo que usa o Spring
    └── controller/ (API REST + DTOs)  repository/ (JPA + H2)  security/ (valida o JWT)  config/
```

Regras do `domain`: preço não pode ser negativo, a categoria do produto precisa existir e não é possível apagar categoria que tenha produtos.

## Como rodar
Requisitos: JDK 21 e Maven.

```bash
mvn clean install
cd spring
mvn spring-boot:run
```

- Console do H2: http://localhost:8082/h2-console (JDBC URL `jdbc:h2:mem:cardapiodb`, usuário `sa`, senha vazia)
- Ao subir com o banco vazio, carrega um **cardápio de exemplo** (4 categorias, 9 produtos e 3 adicionais). Como o H2 é em memória, tudo volta ao exemplo ao reiniciar.
- O serviço só **valida** o token. Quem emite é o servicoLogin (8085), que precisa estar no ar para você obter um token de `ADMIN`.

## Rotas
| Rota | Acesso | Resposta |
| --- | --- | --- |
| `GET /categorias`, `/categorias/{id}` | público | 200 |
| `GET /produtos`, `/produtos?categoriaId=1`, `/produtos/{id}` | público | 200 |
| `GET /adicionais`, `/adicionais/{id}` | público | 200 |
| `POST /categorias`, `/produtos`, `/adicionais` | `ADMIN` | 201 |
| `PUT /categorias/{id}`, `/produtos/{id}`, `/adicionais/{id}` | `ADMIN` | 200 |
| `PATCH /produtos/{id}/disponibilidade` | `ADMIN` | 200 |
| `DELETE /categorias/{id}`, `/produtos/{id}`, `/adicionais/{id}` | `ADMIN` | 200 |

Corpos:

```json
POST /categorias                    { "nome": "Combos" }
POST /produtos                      { "categoriaId": 1, "nome": "Burger Bacon", "descricao": "...",
                                      "preco": 29.90, "imagemUrl": null, "disponivel": true }
PATCH /produtos/1/disponibilidade   { "disponivel": false }
POST /adicionais                    { "nome": "Bacon extra", "preco": 4.00, "disponivel": true }
```

`disponivel` é opcional (se faltar, o item nasce disponível). O `PATCH` tira um item do cardápio ("acabou o bacon") sem apagar.

Erros: `{"erro": "mensagem"}` com 400 (dado inválido, categoria inexistente ou com produtos), 401 (sem token), 403 (não é ADMIN) e 404 (id inexistente).

## Integração com os outros serviços
- Usa o **mesmo `app.jwt.secret`** do servicoLogin para validar o token e ler o `role`.
- O **servicoPedido** consulta `GET /produtos/{id}` e `GET /adicionais/{id}` (rotas públicas) para pegar preço e disponibilidade.
- CORS em `app.cors.origins`: `localhost:8081` (Expo web), `3000`, `4200` e `5173`.

## Testar no Postman
1. `Import` → `postman/servicoCardapio.postman_collection.json`.
2. Suba o servicoLogin (8085) e o servicoCardapio (8082).
3. Clique na coleção → **Run** e rode tudo em ordem. Os itens `0a/0b/0c` fazem o login e guardam os tokens; cada requisição tem testes com o status esperado.

Na mão, envie o token em **Authorization → Bearer Token**.

## Testes
- `domain` (sem Spring, sem banco): `cd domain && mvn test`. Cobre categoria, produto, disponibilidade e adicional.
- `spring`: `ServicoCardapioApplicationTests` verifica se o contexto sobe (H2, sem Docker).