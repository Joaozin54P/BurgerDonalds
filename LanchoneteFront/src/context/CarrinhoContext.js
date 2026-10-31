import React, { createContext, useContext, useState } from 'react';

const Ctx = createContext(null);
export const useCarrinho = () => useContext(Ctx);

// linha do carrinho: { p: produto, q: quantidade, extras: [adicionais], obs }
export const precoLinha = (l) => (+l.p.preco + l.extras.reduce((x, a) => x + +a.preco, 0)) * l.q;

export function CarrinhoProvider({ children }) {
  const [linhas, setLinhas] = useState([]);
  const adicionar = (l) => setLinhas((x) => [...x, l]);
  const remover = (i) => setLinhas((x) => x.filter((_, k) => k !== i));
  const limpar = () => setLinhas([]);
  const total = linhas.reduce((x, l) => x + precoLinha(l), 0);
  const qtd = linhas.reduce((x, l) => x + l.q, 0);
  return <Ctx.Provider value={{ linhas, adicionar, remover, limpar, total, qtd }}>{children}</Ctx.Provider>;
}
