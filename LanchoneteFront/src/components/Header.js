import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { C } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useLayout } from '../hooks/useLayout';
import { Btn, Avatar } from './ui';
import Logo from './Logo';

export default function Header({ tab, setTab }) {
  const { user, staff, admin, sair, abrirLogin } = useAuth();
  const { wide, compact } = useLayout();
  const abas = [['menu', 'Cardápio'], ['pedidos', 'Pedidos'], ...(staff ? [['cozinha', 'Cozinha']] : []), ...(admin ? [['admin', 'Admin']] : [])];
  const ir = (k) => (k !== 'menu' && !user ? abrirLogin() : setTab(k));

  const nav = abas.map(([k, l]) => (
    <Pressable key={k} onPress={() => ir(k)} style={({ hovered }) => [s.navB, tab === k && s.navOn, tab !== k && hovered && { backgroundColor: 'rgba(255,255,255,0.06)' }]}>
      <Text style={[s.navT, tab === k && { color: '#FBF8F1' }]}>{l}</Text>
    </Pressable>
  ));

  const conta = user ? (
    <Pressable onPress={sair} style={({ hovered }) => [s.conta, hovered && { backgroundColor: 'rgba(255,255,255,0.08)' }]} accessibilityLabel="sair">
      <Avatar nome={user.nome} size={compact ? 32 : 34} />
      {!compact && <Text style={s.nome} numberOfLines={1}>{user.nome.split(' ')[0]}</Text>}
      <Text style={s.sair}>Sair</Text>
    </Pressable>
  ) : (
    <Btn small onPress={abrirLogin}>Entrar</Btn>
  );

  return (
    <View style={s.barra}>
      <View style={[s.linha, wide ? { height: 68 } : { height: 60 }]}>
        <Logo size={compact ? 34 : 38} />
        {wide && <View style={s.navWide}>{nav}</View>}
        {conta}
      </View>
      {!wide && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.navNarrow}>{nav}</ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  barra: { backgroundColor: C.ink, paddingHorizontal: 16, alignItems: 'center' },
  linha: { width: '100%', maxWidth: 1240, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  navWide: { flexDirection: 'row', gap: 4 },
  navNarrow: { paddingBottom: 10, gap: 6 },
  navB: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: 11 },
  navOn: { backgroundColor: C.ink3 },
  navT: { color: '#B9B4A4', fontWeight: '700', fontSize: 14 },
  conta: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 5, paddingLeft: 5, paddingRight: 12, borderRadius: 99 },
  nome: { color: '#FBF8F1', fontWeight: '700', fontSize: 14, maxWidth: 110 },
  sair: { color: '#A29D8D', fontWeight: '700', fontSize: 12 },
});
