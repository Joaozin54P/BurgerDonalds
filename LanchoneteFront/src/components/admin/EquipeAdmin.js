import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Btn, Input, Chip } from '../ui';
import { common } from '../../theme';
import * as admin from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

const PERFIS = ['COZINHA', 'ADMIN', 'CLIENTE'];

export default function EquipeAdmin() {
  const { say } = useToast();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState('COZINHA');

  const criar = async () => {
    if (!nome.trim() || !email.trim() || !senha) return say('Preencha nome, e-mail e senha');
    try {
      await admin.criarUsuario(nome.trim(), email.trim(), senha, perfil);
      say(`Usuário ${perfil} criado: ${email.trim()}`);
      setNome(''); setEmail(''); setSenha('');
    } catch (x) { say(x.message); }
  };

  return (
    <>
      <Text style={common.sheetH}>Novo funcionário</Text>
      <Input placeholder="Nome" value={nome} onChangeText={setNome} />
      <Input placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <Input placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 }}>
        {PERFIS.map((p) => (
          <Chip key={p} label={p} ativo={p === perfil} onPress={() => setPerfil(p)} />
        ))}
      </View>
      <Btn onPress={criar}>Criar usuário</Btn>
    </>
  );
}
