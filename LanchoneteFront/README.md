# BurgerDonalds — App (front-end)

Aplicativo do **BurgerDonalds** em **React Native (Expo)**: o cliente vê o cardápio, monta o pedido, recebe uma **senha de retirada** e acompanha o status. A cozinha e o administrador têm telas próprias. Roda no celular, no emulador e no navegador (web).

**Autores:** João Pedro Machado e Giovanna Aparecida

## Tecnologias
React 19 · React Native 0.86 · Expo · react-native-web · JavaScript

O app fala **somente com o gateway** (porta `8080`), que encaminha cada rota ao serviço certo (login, cardápio e pedido).

## Telas e perfis
| Tela | Quem acessa | O que faz |
| --- | --- | --- |
| Cardápio | todos (visitante inclusive) | Navega por categoria, escolhe produto e adicionais, monta o carrinho. Para finalizar, pede login |
| Pedidos | usuário logado | Lista os próprios pedidos com senha de retirada, barra de progresso do status e botão de cancelar (só enquanto `CRIADO`) |
| Cozinha | `COZINHA` e `ADMIN` | Fila de pedidos: começar preparo, marcar pronto, entregar (retirar) ou cancelar |
| Admin | `ADMIN` | CRUD de produtos (com "acabou" para tirar do cardápio sem apagar), categorias e adicionais; criação de usuários da equipe (cozinha/admin) |

Login e cadastro abrem em uma janela sobre a tela atual. Pedidos e Cozinha atualizam sozinhos a cada 5 segundos.

## Estrutura

```
front/
├── App.js                 raiz: providers, cabeçalho e troca de abas
├── index.js               ponto de entrada do Expo
├── app.json  package.json
└── src/
    ├── config.js          HOST e API_URL (endereço do gateway)
    ├── theme.js  utils.js paleta/estilos e funções auxiliares
    ├── services/          chamadas HTTP (api, auth, cardápio, pedido, admin)
    ├── context/           Auth (login/token), Carrinho e Toast (avisos)
    ├── hooks/             useCarregar, usePolling, useLayout (celular x computador)
    ├── screens/           Cardapio, Pedidos, Cozinha, Admin
    └── components/        Header, Logo, AuthSheet (login), CartContent/CartSheet, ItemSheet, ui e admin/
```

## Visual
Tema escuro (carvão) + creme + laranja-brasa, definido em `src/theme.js`. O layout é **responsivo** (`useLayout`):
- **Computador/tablet (≥ 900 px):** cabeçalho em linha, hero grande, cardápio em grade e **carrinho fixo ao lado**; a cozinha vira **colunas** (Novos, Em preparo, Prontos).
- **Celular:** abas abaixo do logo, cardápio em lista, barra "Ver pedido" no rodapé e carrinho em gaveta.

A logo é desenhada com `View`s (`components/Logo.js`), sem imagem e sem biblioteca de ícones, então não há dependência nova.

Toda chamada passa por `src/services/api.js`, que anexa o token (`Authorization: Bearer ...`) e traduz os erros do backend em mensagens para o usuário.

## Como rodar

### 1. Suba o backend (nesta ordem)
1. servicoLogin (`8085`), servicoCardapio (`8082`) e servicoPedido (`8083`)
2. gateway (`8080`)

### 2. Configure o endereço do gateway
Em `src/config.js`, o `HOST` muda conforme onde o app roda:

| Onde roda | HOST |
| --- | --- |
| Emulador Android | `10.0.2.2` (padrão) |
| Simulador iOS e navegador (web) | `localhost` (padrão) |
| Celular de verdade | IP do PC na mesma rede Wi-Fi (ex.: `192.168.0.15`) |

No celular de verdade, troque o `HOST` direto no arquivo e deixe o firewall do PC liberar a porta `8080`.

### 3. Rode o app
Requisitos: Node.js (LTS) e npm.

```bash
npm install
npx expo start
```

No terminal do Expo: `a` abre o emulador Android, `i` o simulador iOS, `w` o navegador, ou leia o QR code com o **Expo Go** no celular. Também funciona com `npm run android`, `npm run ios` e `npm run web`.

## Usuários de teste
| Perfil | E-mail | Senha |
| --- | --- | --- |
| ADMIN | admin@lanchonete.com | admin123 |
| COZINHA | cozinha@lanchonete.com | cozinha123 |

Clientes podem se cadastrar pela própria tela de login.

## Como o pedido é enviado
Ao fazer o pedido, o app gera uma chave única (`Idempotency-Key`) e a envia no `POST /pedidos`. Se o cliente clicar duas vezes ou a rede cair e o app tentar de novo, a **mesma chave** é reaproveitada e o backend devolve o mesmo pedido, sem duplicar. Se o carrinho mudar, é um pedido novo e a chave também.

## Problemas comuns
- **"Gateway fora do ar. Confira o HOST...":** o app mostra essa mensagem para qualquer falha de rede. Verifique se o gateway está rodando na `8080`, se o `HOST` em `src/config.js` está certo para onde o app roda e, na **web**, se o CORS dos serviços inclui `http://localhost:8081` (`app.cors.origins`).
- **"Sessão expirada, entre de novo":** o token (válido por 2 horas) venceu. Faça login de novo. O token fica só em memória, então recarregar a página também pede login.
- **Cardápio vazio ou indisponível:** o servicoCardapio ou o gateway não está no ar. Use "Tentar de novo" na tela.
- **Aviso de versões do Expo/React Native:** rode `npx expo install --fix`.