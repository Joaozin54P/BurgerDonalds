import { C } from './theme';

export const R = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const emoji = (n = '') => {
  n = n.toLowerCase();
  if (/burger|lanche|x-|hamb|bacon|duplo|combo|smash|chapa/.test(n)) return '🍔';
  if (/batata|fritas|onion|cebola|nugget|por[cç]/.test(n)) return '🍟';
  if (/refri|suco|coca|bebida|agua|água|milk|shake/.test(n)) return '🥤';
  if (/sorvete|sobremesa|brownie|pudim|torta/.test(n)) return '🍦';
  if (/hot|dog|cachorro/.test(n)) return '🌭';
  return '🍽️';
};

// emoji do produto; se o nome não disser nada, usa o da categoria
export const emojiProduto = (nome, categoria) => {
  const e = emoji(nome);
  return e !== '🍽️' || !categoria ? e : emoji(categoria);
};

export const FLOW = ['CRIADO', 'EM_PREPARO', 'PRONTO', 'RETIRADO'];
export const LBL = { CRIADO: 'Recebido', EM_PREPARO: 'Na chapa', PRONTO: 'Pronto', RETIRADO: 'Retirado', CANCELADO: 'Cancelado' };

// cores de cada status (fundo, texto e bolinha)
export const STATUS = {
  CRIADO: { bg: C.amberBg, fg: C.amber, dot: C.amberDot },
  EM_PREPARO: { bg: C.peach, fg: C.orangeDark, dot: C.orange },
  PRONTO: { bg: C.greenBg, fg: C.green, dot: C.green },
  RETIRADO: { bg: C.lineSoft, fg: C.mid, dot: C.mute },
  CANCELADO: { bg: C.redBg, fg: C.red, dot: C.red },
};

// UUID v4 simples (serve de Idempotency-Key; não precisa ser criptográfico)
export const novaChave = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

// ---- só para exibição ----

// minutos desde um horário ISO do backend (LocalDateTime). Devolve null se não der para ler.
export const minutosDesde = (iso) => {
  if (!iso) return null;
  const t = Date.parse(String(iso).replace(/(\.\d{3})\d+/, '$1'));
  return Number.isNaN(t) ? null : Math.max(0, Math.floor((Date.now() - t) / 60000));
};

export const tempoCurto = (min) => {
  if (min == null) return '';
  if (min < 1) return 'agora';
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}`;
};

export const iniciais = (nome = '') =>
  nome.trim().split(/\s+/).slice(0, 2).map((p) => (p[0] || '').toUpperCase()).join('');

// fundo suave diferente para cada produto sem foto
const TINTS = ['#F8E4D6', '#F4EBD0', '#E4ECD9', '#F6DDD7', '#EADFC9', '#E3E6EE'];
export const tint = (id) => TINTS[Math.abs(Number(id) || 0) % TINTS.length];
