import { useState } from 'react';
import { useWindowDimensions } from 'react-native';

// tela larga (computador/tablet): cabeçalho em linha, carrinho ao lado, cozinha em colunas
export function useLayout() {
  const { width } = useWindowDimensions();
  return { width, wide: width >= 900, compact: width < 600 };
}

// grade de N colunas com largura exata (mede o espaço disponível): { onLayout, largura }
export function useGrade(colunas, gap) {
  const [w, setW] = useState(0);
  const largura = colunas > 1 && w ? Math.floor((w - gap * (colunas - 1)) / colunas) : '100%';
  return { onLayout: (e) => setW(e.nativeEvent.layout.width), largura };
}
