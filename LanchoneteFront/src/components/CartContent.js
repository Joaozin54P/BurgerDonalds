import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Btn, Input, Chip } from './ui';
import { C, common } from '../theme';
import { R } from '../utils';
import { useCarrinho, precoLinha } from '../context/CarrinhoContext';

const PAGAMENTOS = [['PIX', 'PIX'], ['CREDITO', 'Crédito'], ['DEBITO', 'Débito'], ['DINHEIRO', 'Dinheiro']];

// Conteúdo do carrinho. Aparece na gaveta (celular) e no painel lateral (computador).
export default function CartContent({ onSend }) {
  const { linhas, remover, total, qtd } = useCarrinho();
  const [pg, setPg] = useState('PIX');
  const [obs, setObs] = useState('');
  // depois de fazer o pedido o carrinho esvazia: limpa também a observação
  useEffect(() => { if (!linhas.length) setObs(''); }, [linhas.length]);

  return (
    <View>
      <View style={common.row}>
        <Text style={common.h2}>Seu pedido</Text>
        {qtd > 0 && <View style={s.badge}><Text style={s.badgeT}>{qtd} {qtd === 1 ? 'item' : 'itens'}</Text></View>}
      </View>

      {!linhas.length ? (
        <View style={s.vazio}>
          <Text style={{ fontSize: 38 }}>🛍️</Text>
          <Text style={[common.h3, { marginTop: 6 }]}>Seu pedido está vazio</Text>
          <Text style={[common.muted, { textAlign: 'center' }]}>Escolha um item do cardápio para começar.</Text>
        </View>
      ) : (
        <>
          <View style={{ marginTop: 6 }}>
            {linhas.map((l, i) => (
              <View key={i} style={[s.linha, i > 0 && { borderTopWidth: 1, borderTopColor: C.lineSoft }]}>
                <View style={{ flex: 1 }}>
                  <Text style={s.nome}>{l.q}× {l.p.nome}</Text>
                  {(l.extras.length > 0 || !!l.obs) && (
                    <Text style={s.sub}>{l.extras.map((a) => a.nome).join(', ')}{l.obs ? (l.extras.length ? ' · ' : '') + l.obs : ''}</Text>
                  )}
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={common.price}>{R(precoLinha(l))}</Text>
                  <Pressable onPress={() => remover(i)} accessibilityLabel="remover" hitSlop={8}><Text style={s.remover}>Remover</Text></Pressable>
                </View>
              </View>
            ))}
          </View>

          <Text style={common.label}>Forma de pagamento</Text>
          <View style={s.pags}>
            {PAGAMENTOS.map(([v, rot]) => <Chip key={v} label={rot} ativo={pg === v} onPress={() => setPg(v)} style={s.pag} />)}
          </View>
          <Input placeholder="Observação do pedido (opcional)" value={obs} onChangeText={setObs} />

          <View style={s.total}>
            <Text style={s.totalL}>Total</Text>
            <Text style={s.totalV}>{R(total)}</Text>
          </View>
          <Btn onPress={() => onSend(pg, obs.trim())}>Fazer pedido</Btn>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  badge: { backgroundColor: C.peach, borderRadius: 99, paddingVertical: 4, paddingHorizontal: 11 },
  badgeT: { color: C.orangeDark, fontWeight: '800', fontSize: 12 },
  vazio: { alignItems: 'center', paddingVertical: 34, gap: 2 },
  linha: { flexDirection: 'row', gap: 12, paddingVertical: 13 },
  nome: { color: C.ink, fontWeight: '700', fontSize: 15 },
  sub: { color: C.mute, fontSize: 12.5, marginTop: 2 },
  remover: { color: C.mute, fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' },
  pag: { flexBasis: '47%', flexGrow: 1, alignItems: 'center' },
  pags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6, marginBottom: 6 },
  total: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14, marginBottom: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: C.lineSoft },
  totalL: { color: C.mid, fontWeight: '700', fontSize: 15 },
  totalV: { color: C.ink, fontWeight: '800', fontSize: 28, letterSpacing: -0.8 },
});
