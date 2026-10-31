import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Btn, Input, Sheet, Qtd, Check } from './ui';
import { C, common } from '../theme';
import { R, emojiProduto, tint } from '../utils';
import { precoLinha } from '../context/CarrinhoContext';

export default function ItemSheet({ produto, categoria, adicionais, onAdd, onClose }) {
  const [q, setQ] = useState(1);
  const [extras, setExtras] = useState([]);
  const [obs, setObs] = useState('');
  const tem = (a) => extras.some((e) => e.id === a.id);
  const alternar = (a) => setExtras((x) => (tem(a) ? x.filter((e) => e.id !== a.id) : [...x, a]));

  return (
    <Sheet onClose={onClose}>
      <View style={[s.capa, { backgroundColor: tint(produto.id) }]}>
        {produto.imagemUrl
          ? <Image source={{ uri: produto.imagemUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          : <Text style={{ fontSize: 76 }}>{emojiProduto(produto.nome, categoria)}</Text>}
      </View>
      <Text style={[common.h1, { fontSize: 26, marginTop: 14 }]}>{produto.nome}</Text>
      <Text style={[common.body, { marginTop: 4 }]}>{produto.descricao}</Text>

      {adicionais.length > 0 && <Text style={s.secao}>Turbine seu lanche</Text>}
      {adicionais.map((a) => (
        <Pressable key={a.id} onPress={() => alternar(a)} style={({ hovered }) => [s.opt, tem(a) && s.optOn, !tem(a) && hovered && { backgroundColor: C.cream }]}>
          <Check on={tem(a)} />
          <Text style={s.optN}>{a.nome}</Text>
          <Text style={s.optP}>+ {R(a.preco)}</Text>
        </Pressable>
      ))}

      <Text style={s.secao}>Alguma observação?</Text>
      <Input placeholder="Observação (ex: sem cebola)" value={obs} onChangeText={setObs} />

      <View style={[common.row, { marginTop: 14 }]}>
        <Qtd valor={q} onMenos={() => setQ(Math.max(1, q - 1))} onMais={() => setQ(Math.min(20, q + 1))} />
        <Btn style={{ flex: 1 }} onPress={() => onAdd({ p: produto, q, extras, obs: obs.trim() })}>
          Adicionar · {R(precoLinha({ p: produto, q, extras }))}
        </Btn>
      </View>
    </Sheet>
  );
}

const s = StyleSheet.create({
  capa: { height: 150, borderRadius: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  secao: { color: C.ink, fontWeight: '800', fontSize: 15, marginTop: 18, marginBottom: 6 },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 14, padding: 13, marginVertical: 4 },
  optOn: { borderColor: C.orange, backgroundColor: C.peach },
  optN: { flex: 1, color: C.ink, fontWeight: '700', fontSize: 14.5 },
  optP: { color: C.orangeDark, fontWeight: '800', fontSize: 14 },
});
