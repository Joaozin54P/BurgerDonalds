import React from 'react';
import { View, Text } from 'react-native';
import { C } from '../theme';

// Marca do BurgerDonalds. O hambúrguer é desenhado com Views (sem imagem e sem biblioteca de ícones).
export default function Logo({ size = 38, texto = true, fundo = 'escuro' }) {
  const u = size / 38;
  const pao = '#FFF1E2';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 * Math.max(u, 0.8) }}>
      <View style={{ width: size, height: size, borderRadius: size * 0.3, backgroundColor: C.orange, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 22 * u, height: 12 * u, borderTopLeftRadius: 12 * u, borderTopRightRadius: 12 * u, borderBottomLeftRadius: 2 * u, borderBottomRightRadius: 2 * u, backgroundColor: pao }}>
          {[[5, 3], [10, 5], [15, 3]].map(([x, y], i) => (
            <View key={i} style={{ position: 'absolute', left: x * u, top: y * u, width: 2.4 * u, height: 1.6 * u, borderRadius: u, backgroundColor: C.orange, opacity: 0.55 }} />
          ))}
        </View>
        <View style={{ width: 25 * u, height: 4.5 * u, borderRadius: 3 * u, backgroundColor: C.ink, marginVertical: 1.5 * u }} />
        <View style={{ width: 22 * u, height: 6 * u, borderBottomLeftRadius: 6 * u, borderBottomRightRadius: 6 * u, borderTopLeftRadius: 2 * u, borderTopRightRadius: 2 * u, backgroundColor: pao }} />
      </View>
      {texto && (
        <View>
          <Text style={{ fontSize: 20 * u, fontWeight: '800', letterSpacing: -0.6, color: fundo === 'escuro' ? '#F8F4EA' : C.ink, lineHeight: 22 * u }}>
            Burger<Text style={{ color: C.orange }}>Donalds</Text>
          </Text>
          <Text style={{ fontSize: 8.5 * u, fontWeight: '700', letterSpacing: 1.6, color: fundo === 'escuro' ? '#A29D8D' : C.mute, marginTop: 1 }}>
            FEITO NA CHAPA
          </Text>
        </View>
      )}
    </View>
  );
}
