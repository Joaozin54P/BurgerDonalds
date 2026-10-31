import http from 'k6/http';
import { check, fail } from 'k6';
import { Counter, Rate } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const EMAIL = __ENV.EMAIL || 'admin@lanchonete.com';
const SENHA = __ENV.SENHA || 'admin123';
const PRODUTO_ID = __ENV.PRODUTO_ID ? Number(__ENV.PRODUTO_ID) : null;
const QTD_REQUISICOES = Number(__ENV.QTD_REQUISICOES || 30);
const QUANTIDADE = Number(__ENV.QUANTIDADE || 1);
const MODO = __ENV.MODO || 'idempotencia';

const pedidosCriados = new Counter('pedidos_criados');
const pedidosRepetidos = new Counter('pedidos_repetidos');
const errosNegocio = new Counter('erros_negocio');
const falhasInesperadas = new Counter('falhas_inesperadas');
const taxaSucesso = new Rate('taxa_sucesso_pedido');

export const options = {
    scenarios: {
        pedidos_concorrentes: {
            executor: 'shared-iterations',
            vus: QTD_REQUISICOES,
            iterations: QTD_REQUISICOES,
            maxDuration: '60s',
        },
    },
    thresholds: {
        taxa_sucesso_pedido: ['rate>0.99'],
        http_req_failed: ['rate<0.01'],
    },
};

const jsonParams = (token, idempotencyKey) => ({
    headers: {
        // o token agora vem no cookie HttpOnly do login (nao mais no corpo da resposta)
        Cookie: `token=${token}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
    },
});

export function setup() {
    const login = http.post(
        `${BASE_URL}/auth/login`,
        JSON.stringify({ email: EMAIL, senha: SENHA }),
        { headers: { 'Content-Type': 'application/json' } },
    );

    if (login.status !== 200) {
        fail(`Login falhou (${login.status}): ${login.body}`);
    }

    const cookieToken = login.cookies && login.cookies.token && login.cookies.token[0];
    if (!cookieToken) {
        fail(`Login nao devolveu o cookie "token": ${login.body}`);
    }
    const token = cookieToken.value;

    let produtoId = PRODUTO_ID;
    if (produtoId === null) {
        const produtos = http.get(`${BASE_URL}/produtos`, jsonParams(token, 'setup-produtos'));
        if (produtos.status !== 200) {
            fail(`Consulta de produtos falhou (${produtos.status}): ${produtos.body}`);
        }

        const disponivel = JSON.parse(produtos.body).find((produto) => produto.disponivel !== false);
        if (!disponivel) {
            fail('Nenhum produto disponivel foi encontrado');
        }
        produtoId = disponivel.id;
    }

    return {
        token,
        produtoId,
        chaveCompartilhada: __ENV.IDEMPOTENCY_KEY || `k6-concorrencia-${Date.now()}`,
    };
}

export default function (dados) {
    const idempotencyKey = MODO === 'idempotencia'
        ? dados.chaveCompartilhada
        : `${dados.chaveCompartilhada}-${__VU}-${__ITER}`;

    const payload = JSON.stringify({
        formaPagamento: 'PIX',
        observacao: `Teste k6 ${MODO}`,
        itens: [{
            produtoId: dados.produtoId,
            quantidade: QUANTIDADE,
            adicionaisIds: [],
            observacao: '',
        }],
    });

    const resposta = http.post(
        `${BASE_URL}/pedidos`,
        payload,
        jsonParams(dados.token, idempotencyKey),
    );

    const statusEsperado = MODO === 'idempotencia' ? [200, 201] : [201];
    const sucesso = check(resposta, {
        'pedido respondeu com status esperado': (res) => statusEsperado.includes(res.status),
    });
    taxaSucesso.add(sucesso);

    if (resposta.status === 201) {
        pedidosCriados.add(1);
    } else if (resposta.status === 200 && MODO === 'idempotencia') {
        pedidosRepetidos.add(1);
    } else if (resposta.status >= 400 && resposta.status < 500) {
        errosNegocio.add(1);
    } else if (!sucesso) {
        falhasInesperadas.add(1);
    }
}

export function teardown(dados) {
    const pedidos = http.get(`${BASE_URL}/pedidos/meus`, {
        headers: { Cookie: `token=${dados.token}` },
    });

    console.log('====================================');
    console.log(`Modo:                    ${MODO}`);
    console.log(`Requisicoes enviadas:    ${QTD_REQUISICOES}`);
    console.log(`Produto testado:         ${dados.produtoId}`);
    console.log(`Historico retornado:     ${pedidos.status}`);
    console.log('');
    console.log('Modo idempotencia: espere 1 pedido criado (201) e');
    console.log(`${QTD_REQUISICOES - 1} respostas repetidas (200).`);
    console.log('Modo unico: espere um 201 por requisicao.');
    console.log('Confira as metricas pedidos_criados, pedidos_repetidos e falhas_inesperadas.');
    console.log('====================================');
}