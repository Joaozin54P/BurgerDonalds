import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { C } from '../theme';

const Ctx = createContext(null);
export const useToast = () => useContext(Ctx);

// o aviso em si. Fica num componente à parte para também poder aparecer por cima de janelas (Modal)
export function ToastBubble({ top = 84 }) {
  const { msg } = useContext(Ctx);
  if (!msg) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top, left: 16, right: 16, alignItems: 'center', zIndex: 50 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.ink, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14, maxWidth: 480, boxShadow: '0 10px 30px rgba(39,38,31,0.28)' }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.orange }} />
        <Text style={{ color: '#FBF8F1', fontWeight: '600', fontSize: 14, flexShrink: 1 }}>{msg}</Text>
      </View>
    </View>
  );
}

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('');
  const say = useCallback((m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); }, []);
  return (
    <Ctx.Provider value={{ say, msg }}>
      {children}
      <ToastBubble />
    </Ctx.Provider>
  );
}
