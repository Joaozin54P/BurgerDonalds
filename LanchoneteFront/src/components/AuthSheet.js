import React, { useState } from 'react';
import { Text, View, Pressable, Modal, ScrollView, StyleSheet } from 'react-native';
import { Btn, Input } from './ui';
import Logo from './Logo';
import { C, common } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useToast, ToastBubble } from '../context/ToastContext';
import { useLayout } from '../hooks/useLayout';

const BENEFICIOS = ['Monte o pedido em poucos toques', 'Receba a senha de retirada na hora', 'Acompanhe cada etapa até o balcão'];

export default function AuthSheet() {
  const { loginAberto, fecharLogin, entrar, cadastrar } = useAuth();
  const { say } = useToast();
  const { wide } = useLayout();
  const [reg, setReg] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  if (!loginAberto) return null;

  const enviar = async () => {
    try { reg ? await cadastrar(nome, email, senha) : await entrar(email, senha); }
    catch (x) { say(x.message); }
  };

  const formulario = (
    <View style={wide ? s.formWide : s.formNarrow}>
      <Pressable onPress={fecharLogin} style={s.fechar} accessibilityLabel="fechar"><Text style={s.fecharT}>✕</Text></Pressable>
      <Text style={common.eyebrow}>{reg ? 'Crie sua conta' : 'Bem-vindo de volta'}</Text>
      <Text style={s.titulo}>{reg ? 'Criar conta' : 'Entrar'}</Text>
      <Text style={[common.body, { marginBottom: 14 }]}>{reg ? 'Leva menos de um minuto.' : 'Acesse para fazer pedidos e acompanhar sua senha.'}</Text>

      {reg && (<><Text style={common.label}>Nome</Text><Input placeholder="Seu nome" value={nome} onChangeText={setNome} /></>)}
      <Text style={common.label}>E-mail</Text>
      <Input placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Text style={common.label}>Senha</Text>
      <Input placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

      <Btn onPress={enviar} style={{ marginTop: 16 }}>{reg ? 'Cadastrar' : 'Entrar'}</Btn>
      <Pressable onPress={() => setReg(!reg)} style={s.troca}>
        <Text style={common.body}>{reg ? 'Já tem conta? ' : 'Ainda não tem conta? '}<Text style={s.trocaLink}>{reg ? 'Já tenho conta' : 'Criar conta'}</Text></Text>
      </Pressable>
    </View>
  );

  return (
    <Modal transparent animationType="fade" onRequestClose={fecharLogin}>
      <Pressable style={[s.fundo, wide && { justifyContent: 'center', alignItems: 'center', padding: 24 }]} onPress={fecharLogin}>
        <Pressable style={[s.cartao, wide ? s.cartaoWide : s.cartaoNarrow]}>
          {wide ? (
            <>
              <View style={s.painel}>
                <Logo size={42} />
                <View style={s.arte}>
                  <View style={s.circulo} />
                  <Text style={s.emoji}>🍔</Text>
                  <Text style={s.frituras}>🍟</Text>
                </View>
                <View>
                  <Text style={s.painelH}>Fome? Chegou{'\n'}a hora.</Text>
                  {BENEFICIOS.map((b) => (
                    <View key={b} style={s.benef}><View style={s.benefDot} /><Text style={s.benefT}>{b}</Text></View>
                  ))}
                </View>
              </View>
              <View style={{ flex: 1 }}>{formulario}</View>
            </>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <View style={s.topo}><Logo size={36} /></View>
              {formulario}
            </ScrollView>
          )}
        </Pressable>
        <ToastBubble />
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(39,38,31,0.62)', justifyContent: 'flex-end' },
  cartao: { backgroundColor: '#fff', overflow: 'hidden' },
  cartaoNarrow: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '94%' },
  cartaoWide: { flexDirection: 'row', width: '100%', maxWidth: 940, minHeight: 560, borderRadius: 30, boxShadow: '0 30px 80px rgba(0,0,0,0.35)' },
  topo: { backgroundColor: C.ink, paddingVertical: 20, paddingHorizontal: 24 },
  formNarrow: { padding: 24, paddingBottom: 30 },
  formWide: { padding: 44, paddingTop: 48, flex: 1, justifyContent: 'center' },
  titulo: { color: C.ink, fontSize: 30, fontWeight: '800', letterSpacing: -0.8, marginTop: 6, marginBottom: 4 },
  fechar: { position: 'absolute', right: 18, top: 18, width: 34, height: 34, borderRadius: 17, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', zIndex: 5 },
  fecharT: { color: C.mid, fontWeight: '800', fontSize: 14 },
  troca: { alignItems: 'center', marginTop: 16, padding: 6 },
  trocaLink: { color: C.orange, fontWeight: '800' },
  painel: { width: 400, backgroundColor: C.ink, padding: 36, justifyContent: 'space-between', overflow: 'hidden' },
  arte: { height: 210, alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  circulo: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: C.orange },
  emoji: { fontSize: 104 },
  frituras: { position: 'absolute', fontSize: 52, left: 52, bottom: 8, transform: [{ rotate: '-14deg' }] },
  painelH: { color: '#FBF8F1', fontSize: 38, fontWeight: '800', letterSpacing: -1.2, lineHeight: 40, marginBottom: 18 },
  benef: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  benefDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.orange, borderWidth: 1, borderColor: '#FBF8F1' },
  benefT: { color: '#E6E1D2', fontSize: 14, fontWeight: '600' },
});
