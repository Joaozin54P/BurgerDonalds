import { request } from './api';

// servicoCozinha (pelo gateway): só COZINHA / ADMIN
// fila de trabalho: NA_FILA + EM_PREPARO, do mais antigo para o mais novo
export const fila = () => request('/cozinha/pedidos');
// pedidos prontos (a cozinha não sabe quando o cliente retirou: cruze com o servicoPedido)
export const prontos = () => request('/cozinha/pedidos?status=PRONTO');
// {pedidoId} é o ID do pedido no servicoPedido
export const iniciar = (pedidoId) => request(`/cozinha/pedidos/${pedidoId}/iniciar`, 'POST');
export const pronto = (pedidoId) => request(`/cozinha/pedidos/${pedidoId}/pronto`, 'POST');
