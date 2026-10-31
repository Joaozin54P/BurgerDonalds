import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, Platform, StyleSheet } from 'react-native';
import { C } from './src/theme';
import { ToastProvider } from './src/context/ToastContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CarrinhoProvider } from './src/context/CarrinhoContext';
import Header from './src/components/Header';
import AuthSheet from './src/components/AuthSheet';
import ConfirmHost from './src/components/ConfirmDialog';
import CardapioScreen from './src/screens/CardapioScreen';
import PedidosScreen from './src/screens/PedidosScreen';
import CozinhaScreen from './src/screens/CozinhaScreen';
import AdminScreen from './src/screens/AdminScreen';

function Main() {
  const { user } = useAuth();
  const [tab, setTab] = useState('menu');
  // ao sair, volta para o cardápio
  useEffect(() => { if (!user) setTab('menu'); }, [user]);

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.ink} />
      <Header tab={tab} setTab={setTab} />
      {tab === 'menu' && <CardapioScreen onPedidoFeito={() => setTab('pedidos')} />}
      {tab === 'pedidos' && <PedidosScreen />}
      {tab === 'cozinha' && <CozinhaScreen />}
      {tab === 'admin' && <AdminScreen />}
      <AuthSheet />
      <ConfirmHost />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CarrinhoProvider>
          <Main />
        </CarrinhoProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.cream, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
});
