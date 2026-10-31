import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Btn, PageHeader } from '../components/ui';
import ItensPedido from '../components/ItensPedido';
import { C, common, sombraLeve } from '../theme';
import { minutosDesde, tempoCurto } from '../utils';
import * as cozinhaService from '../services/cozinhaService';
import * as pedidoService from '../services/pedidoService';
import { usePolling } from '../hooks/usePolling';
import { useLayout } from '../hooks/useLayout';
import { useToast } from '../context/ToastContext';

// Status da COZINHA (servicoCozinha): NA_FILA -> EM_PREPARO -> PRONTO.
// Começar e finalizar o preparo vão para a cozinha; ela avisa o servicoPedido pela fila de mensagens.
// "Retirar" e "Cancelar" continuam sendo do servicoPedido (a cozinha não sabe quando o cliente retirou).
// Todas as ações usam pedidoId (o ID do pedido no servicoPedido).
const PROXIMO = {
  NA_FILA: { label: 'Começar preparo', kind: 'dark', run: (id) => cozinhaService.iniciar(id) },
  EM_PREPARO: { label: 'Marcar como pronto', kind: 'orange', run: (id) => cozinhaService.pronto(id) },
  PRONTO: { label: 'Entregue (retirar)', kind: 'light', run: (id) => pedidoService.retirar(id) },
};

const COLUNAS = [
  ['NA_FILA', 'Novos', 'Acabaram de chegar. Pode acender a chapa.'],
  ['EM_PREPARO', 'Em preparo', 'Na ordem de chegada.'],
  ['PRONTO', 'Prontos', 'Esperando o cliente no balcão.'],
];

export default function CozinhaScreen() {
  const { say } = useToast();
  const { wide } = useLayout();
  const [fila, setFila] = useState([]);

  const atualizar = async () => {
    const [ativos, prontos, pedidos] = await Promise.all([
      cozinhaService.fila(),      // NA_FILA + EM_PREPARO
      cozinhaService.prontos(),   // PRONTO
      pedidoService.todos(),      // status real do pedido (retirado / cancelado)
    ]);
    // a cozinha nunca fica sabendo que o cliente retirou, e o cancelamento chega por mensagem (pode demorar
    // um instante): quem já foi RETIRADO ou CANCELADO no servicoPedido sai do painel
    const statusPedido = new Map(pedidos.map((p) => [p.id, p.status]));
    const encerrado = (o) => ['RETIRADO', 'CANCELADO'].includes(statusPedido.get(o.pedidoId));
    // a cozinha já devolve do mais antigo para o mais novo
    setFila([...ativos, ...prontos].filter((o) => !encerrado(o)));
  };
  usePolling(atualizar);

  const executar = async (fn, id) => {
    try { await fn(id); await atualizar(); } catch (x) { say(x.message); }
  };

  const espera = fila.filter((o) => o.status !== 'PRONTO').map((o) => minutosDesde(o.criadoEm)).filter((m) => m != null);
  const media = espera.length ? Math.round(espera.reduce((a, b) => a + b, 0) / espera.length) : null;

  return (
    <ScrollView contentContainerStyle={s.pagina} showsVerticalScrollIndicator={false}>
      <View style={s.container}>
        <PageHeader eyebrow="O coração da chapa" titulo="Bora pra chapa." sub="Cada pedido no ponto. A tela atualiza sozinha a cada poucos segundos." />

        <View style={s.resumo}>
          <View style={s.resumoItem}><Text style={s.resumoN}>{String(fila.length).padStart(2, '0')}</Text><Text style={s.resumoL}>pedidos na fila</Text></View>
          <View style={s.resumoSep} />
          <View style={s.resumoItem}><Text style={s.resumoN}>{media == null ? '–' : `${media} min`}</Text><Text style={s.resumoL}>espera média</Text></View>
          <View style={s.resumoSep} />
          <View style={s.resumoItem}><Text style={s.resumoN}>{fila.filter((o) => o.status === 'PRONTO').length}</Text><Text style={s.resumoL}>aguardando retirada</Text></View>
        </View>

        {!fila.length && (
          <View style={[common.card, common.empty]}>
            <Text style={common.emptyIco}>👨‍🍳</Text>
            <Text style={common.h3}>Nenhum pedido na fila.</Text>
            <Text style={common.muted}>Quando chegar pedido novo, ele aparece aqui.</Text>
          </View>
        )}

        {!!fila.length && (
          <View style={[s.colunas, wide && { flexDirection: 'row', alignItems: 'flex-start' }]}>
            {COLUNAS.map(([st, titulo, sub]) => {
              const itens = fila.filter((o) => o.status === st);
              return (
                <View key={st} style={[s.coluna, wide && { flex: 1 }]}>
                  <View style={common.row}>
                    <Text style={common.h2}>{titulo}</Text>
                    <View style={s.cont}><Text style={s.contT}>{itens.length}</Text></View>
                  </View>
                  <Text style={[common.muted, { marginBottom: 12 }]}>{sub}</Text>

                  {!itens.length && <Text style={s.vazio}>Nada por aqui.</Text>}
                  {itens.map((o) => <Cartao key={o.pedidoId} o={o} executar={executar} />)}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function Cartao({ o, executar }) {
  const min = minutosDesde(o.criadoEm);
  const atrasado = min != null && min >= 15 && o.status !== 'PRONTO';
  const acao = PROXIMO[o.status];

  return (
    <View style={[s.cartao, sombraLeve, o.status === 'EM_PREPARO' && s.cartaoPreparo]}>
      <View style={common.row}>
        <Text style={s.senha}>#{o.senhaRetirada}</Text>
        {min != null && (
          <View style={[s.tempo, atrasado && { backgroundColor: C.peach }]}>
            <Text style={[s.tempoT, atrasado && { color: C.orangeDark }]}>há {tempoCurto(min)}</Text>
          </View>
        )}
      </View>
      <Text style={[common.muted, { marginBottom: 12 }]}>Cliente #{o.clienteId}</Text>

      <ItensPedido pedido={o} />

      {!!o.observacao && (
        <View style={s.obs}><Text style={s.obsT}>✎  {o.observacao}</Text></View>
      )}

      <View style={{ marginTop: 14, gap: 8 }}>
        <Btn kind={acao.kind} onPress={() => executar(acao.run, o.pedidoId)}>{acao.label}</Btn>
        {o.status === 'NA_FILA' && <Btn small kind="danger" onPress={() => executar(pedidoService.cancelar, o.pedidoId)}>Cancelar</Btn>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  pagina: { paddingHorizontal: 16, paddingBottom: 48, alignItems: 'center' },
  container: { width: '100%', maxWidth: 1240 },
  resumo: { flexDirection: 'row', backgroundColor: C.ink, borderRadius: 20, paddingVertical: 18, paddingHorizontal: 12, marginBottom: 22 },
  resumoItem: { flex: 1, alignItems: 'center' },
  resumoN: { color: '#FBF8F1', fontSize: 28, fontWeight: '800', letterSpacing: -0.8 },
  resumoL: { color: '#A29D8D', fontSize: 12, fontWeight: '600', marginTop: 2, textAlign: 'center' },
  resumoSep: { width: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginVertical: 4 },
  colunas: { gap: 16 },
  coluna: { backgroundColor: C.lineSoft, borderRadius: 24, padding: 16 },
  cont: { minWidth: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  contT: { color: C.ink, fontWeight: '800', fontSize: 13 },
  vazio: { color: C.mute, textAlign: 'center', paddingVertical: 24, fontSize: 13 },
  cartao: { backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: C.line, padding: 16, marginBottom: 12 },
  cartaoPreparo: { borderColor: C.orange, borderWidth: 1.5 },
  senha: { color: C.ink, fontSize: 26, fontWeight: '800', letterSpacing: -0.7 },
  tempo: { backgroundColor: C.lineSoft, borderRadius: 99, paddingVertical: 4, paddingHorizontal: 10 },
  tempoT: { color: C.mid, fontWeight: '800', fontSize: 12 },
  obs: { backgroundColor: C.amberBg, borderRadius: 12, padding: 11, marginTop: 12 },
  obsT: { color: C.amber, fontWeight: '700', fontSize: 13 },
});
