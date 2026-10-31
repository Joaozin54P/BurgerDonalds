import { request } from './api';

// chave: um código único POR PEDIDO (o servicoPedido exige o header Idempotency-Key)
export const criar = (chave, formaPagamento, observacao, linhas) =>
  request('/pedidos', 'POST', {
    formaPagamento,
    observacao: observacao || null,
    itens: linhas.map((l) => ({
      produtoId: l.p.id,
      quantidade: l.q,
      adicionaisIds: l.extras.map((a) => a.id),
      observacao: l.obs || null,
    })),
  }, { 'Idempotency-Key': chave });

export const meus = () => request('/pedidos/meus');
export const todos = () => request('/pedidos'); // COZINHA / ADMIN: todos os pedidos (status real do pedido)
export const retirar = (id) => request(`/pedidos/${id}/retirar`, 'POST');
export const cancelar = (id) => request(`/pedidos/${id}/cancelar`, 'POST');
