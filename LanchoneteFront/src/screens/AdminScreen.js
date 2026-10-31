import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import ProdutosAdmin from '../components/admin/ProdutosAdmin';
import CategoriasAdmin from '../components/admin/CategoriasAdmin';
import AdicionaisAdmin from '../components/admin/AdicionaisAdmin';
import EquipeAdmin from '../components/admin/EquipeAdmin';
import { PageHeader } from '../components/ui';
import { C } from '../theme';

const SECOES = [
  ['produtos', 'Produtos', ProdutosAdmin],
  ['categorias', 'Categorias', CategoriasAdmin],
  ['adicionais', 'Adicionais', AdicionaisAdmin],
  ['equipe', 'Equipe', EquipeAdmin],
];

export default function AdminScreen() {
  const [sec, setSec] = useState('produtos');
  const Secao = SECOES.find(([k]) => k === sec)[2];
  return (
    <ScrollView contentContainerStyle={s.pagina} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={s.container}>
        <PageHeader eyebrow="Painel da loja" titulo="Gerenciar" sub="Cardápio, adicionais e equipe num só lugar." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.abas} contentContainerStyle={{ gap: 4 }}>
          {SECOES.map(([k, l]) => (
            <Pressable key={k} onPress={() => setSec(k)} style={[s.aba, k === sec && s.abaOn]}>
              <Text style={[s.abaT, k === sec && { color: C.orange }]}>{l}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={{ paddingTop: 20 }}>
          <Secao key={sec} />
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pagina: { paddingHorizontal: 16, paddingBottom: 60, alignItems: 'center' },
  container: { width: '100%', maxWidth: 900 },
  abas: { borderBottomWidth: 1, borderBottomColor: C.line, flexGrow: 0 },
  aba: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 3, borderBottomColor: 'transparent', marginBottom: -1 },
  abaOn: { borderBottomColor: C.orange },
  abaT: { color: C.mute, fontWeight: '800', fontSize: 14.5 },
});
