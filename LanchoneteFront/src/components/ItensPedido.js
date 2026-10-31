import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme';

export default function ItensPedido({ pedido }) {
  return (
    <View style={{ gap: 7 }}>
      {pedido.itens.map((i, k) => (
        <View key={k}>
          <Text style={s.linha}><Text style={s.qtd}>{i.quantidade}×</Text>  {i.nomeProduto}</Text>
          {!!i.adicionais?.length && <Text style={s.sub}>+ {i.adicionais.join(', ')}</Text>}
          {!!i.observacao && <Text style={s.obs}>“{i.observacao}”</Text>}
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  linha: { color: C.ink, fontWeight: '600', fontSize: 14.5 },
  qtd: { color: C.orangeDark, fontWeight: '800' },
  sub: { color: C.mute, fontSize: 12.5, marginLeft: 26 },
  obs: { color: C.mute, fontSize: 12.5, fontStyle: 'italic', marginLeft: 26 },
});
