import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Btn, StatusPill, PageHeader } from '../components/ui';
import ItensPedido from '../components/ItensPedido';
import { C, common, sombraLeve } from '../theme';
import { R, FLOW, LBL } from '../utils';
import * as pedidoService from '../services/pedidoService';
import { usePolling } from '../hooks/usePolling';
import { useLayout, useGrade } from '../hooks/useLayout';
import { useToast } from '../context/ToastContext';

const PAGAMENTO = { PIX: 'PIX', CREDITO: 'Crédito', DEBITO: 'Débito', DINHEIRO: 'Dinheiro' };

export default function PedidosScreen() {
  const { say } = useToast();
  const { width } = useLayout();
  const [pedidos, setPedidos] = useState([]);
  const atualizar = async () => setPedidos(await pedidoService.meus());
  usePolling(atualizar);

  const colunas = width >= 1000 ? 2 : 1;
  const grade = useGrade(colunas, 16);

  const cancelar = async (id) => {
    try { await pedidoService.cancelar(id); say('Pedido cancelado'); await atualizar(); }
    catch (x) { say(x.message); }
  };

  return (
    <ScrollView contentContainerStyle={s.pagina} showsVerticalScrollIndicator={false}>
      <View style={s.container}>
        <PageHeader eyebrow="Acompanhe seu lanche" titulo="Meus pedidos" sub="Mostre a senha no balcão quando o pedido estiver pronto." />

        {!pedidos.length && (
          <View style={[common.card, common.empty]}>
            <Text style={common.emptyIco}>🧾</Text>
            <Text style={common.h3}>Você ainda não fez pedidos.</Text>
            <Text style={common.muted}>Quando fizer, ele aparece aqui com a senha de retirada.</Text>
          </View>
        )}

        <View style={s.grade} onLayout={grade.onLayout}>
          {pedidos.map((o) => {
            const passo = FLOW.indexOf(o.status);
            return (
              <View key={o.id} style={[common.card, sombraLeve, s.ticket, { width: grade.largura }]}>
                <View style={common.row}>
                  <View style={s.senha}>
                    <Text style={s.senhaL}>SENHA</Text>
                    <Text style={s.senhaV}>{o.senhaRetirada}</Text>
                  </View>
                  <StatusPill status={o.status} />
                </View>

                {o.status !== 'CANCELADO' && (
                  <View style={{ marginTop: 18, marginBottom: 4 }}>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      {FLOW.map((_, i) => <View key={i} style={[s.barra, i <= passo && { backgroundColor: o.status === 'PRONTO' || o.status === 'RETIRADO' ? C.green : C.orange }]} />)}
                    </View>
                    <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                      {FLOW.map((f, i) => <Text key={f} style={[s.etapa, i === passo && { color: C.ink, fontWeight: '800' }]}>{LBL[f]}</Text>)}
                    </View>
                  </View>
                )}

                <View style={common.divider} />
                <ItensPedido pedido={o} />
                <View style={common.divider} />

                <View style={common.row}>
                  <View>
                    <Text style={s.totalV}>{R(o.total)}</Text>
                    <Text style={common.muted}>{PAGAMENTO[o.formaPagamento] || o.formaPagamento}</Text>
                  </View>
                  {o.status === 'CRIADO' && <Btn small kind="danger" onPress={() => cancelar(o.id)}>Cancelar pedido</Btn>}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pagina: { paddingHorizontal: 16, paddingBottom: 48, alignItems: 'center' },
  container: { width: '100%', maxWidth: 1240 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  ticket: { padding: 20 },
  senha: { backgroundColor: C.ink, borderRadius: 14, paddingVertical: 9, paddingHorizontal: 16 },
  senhaL: { color: '#A29D8D', fontSize: 10, fontWeight: '800', letterSpacing: 1.6 },
  senhaV: { color: C.orange, fontSize: 32, fontWeight: '800', letterSpacing: -0.5, lineHeight: 36 },
  barra: { flex: 1, height: 6, borderRadius: 3, backgroundColor: C.lineSoft },
  etapa: { flex: 1, color: C.mute, fontSize: 11.5, fontWeight: '600' },
  totalV: { color: C.ink, fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
});
