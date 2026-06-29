import { ScrollView, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { MaterialIcons } from '@expo/vector-icons';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'conect365';

export default function AdminScreen() {
  const colors = useColors();
  const [logado, setLogado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState('');

  const [bancos, setBancos] = useState([
    { id: 'bv', nome: 'BV Financeira', taxa: '1.14' },
    { id: 'santander', nome: 'Santander', taxa: '1.59' },
    { id: 'volkswagen', nome: 'Banco Volkswagen', taxa: '1.62' },
    { id: 'bradesco', nome: 'Bradesco', taxa: '1.65' },
    { id: 'bb', nome: 'Banco do Brasil', taxa: '1.82' },
    { id: 'itau', nome: 'Itaú', taxa: '1.74' },
    { id: 'caixa', nome: 'Caixa Econômica', taxa: '1.80' },
    { id: 'sicredi', nome: 'Sicredi', taxa: '1.85' },
    { id: 'pan', nome: 'Banco Pan', taxa: '2.20' },
    { id: 'omni', nome: 'Omni', taxa: '2.90' },
    { id: 'c6', nome: 'C6 Bank', taxa: '1.38' },
    { id: 'safra', nome: 'Banco Safra', taxa: '1.45' },
  ]);

  const [novoNome, setNovoNome] = useState('');
  const [novaTaxa, setNovaTaxa] = useState('');
const handleLogin = () => {
    if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
      setLogado(true);
      setErroLogin('');
    } else {
      setErroLogin('Usuário ou senha incorretos');
    }
  };

  const handleEditarTaxa = (id: string, novaTaxa: string) => {
    setBancos(prev => prev.map(b => b.id === id ? { ...b, taxa: novaTaxa } : b));
  };

  const handleAdicionarBanco = () => {
    if (!novoNome.trim() || !novaTaxa.trim()) {
      Alert.alert('Erro', 'Preencha o nome e a taxa do banco');
      return;
    }
    const novoId = novoNome.toLowerCase().replace(/\s/g, '_');
    setBancos(prev => [...prev, { id: novoId, nome: novoNome, taxa: novaTaxa }]);
    setNovoNome('');
    setNovaTaxa('');
    Alert.alert('Sucesso', `${novoNome} adicionado com sucesso!`);
  };

  const handleSalvar = () => {
    Alert.alert('Salvo!', 'As taxas foram atualizadas com sucesso!');
  };

  if (!logado) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 justify-center">
          <Text className="text-3xl font-bold text-foreground mb-2">Admin</Text>
          <Text className="text-base text-muted mb-8">Acesso restrito</Text>

          <View className="gap-4">
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Usuário</Text>
              <View className="bg-surface rounded-lg border border-border p-4">
                <TextInpu
return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-3xl font-bold text-foreground">Admin</Text>
            <Text className="text-sm text-muted">Gerenciar bancos e taxas</Text>
          </View>
          <Pressable onPress={() => setLogado(false)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <View className="bg-surface rounded-full p-3 border border-border">
              <MaterialIcons name="logout" size={24} color={colors.foreground} />
            </View>
          </Pressable>
        </View>

        {/* Lista de Bancos */}
        <Text className="text-lg font-bold text-foreground mb-3">🏦 Bancos e Taxas</Text>
        <View className="gap-3 mb-6">
          {bancos.map((banco) => (
            <View key={banco.id} className="bg-surface rounded-lg border border-border p-4">
              <Text className="text-sm font-semibold text-foreground mb-2">{banco.nome}</Text>
              <View className="flex-row items-center gap-2">
                <View className="flex-1 bg-background rounded-lg border border-border p-3">
                  <TextInput
                    value={banco.taxa}
                    onChangeText={(t) => handleEditarTaxa(banco.id, t)}
                    keyboardType="decimal-pad"
                    className="text-base font-bold text-primary"
                  />
                </View>
                <Text className="text-sm text-muted">% ao mês</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Adicionar Novo Banco */}
        <Text className="text-lg font-bold text-foreground mb-3">➕ Adicionar Banco</Text>
        <View className="bg-surface rounded-lg border border-border p-4 mb-6 gap-3">
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">Nome do Banco</Text>
            <View className="bg-background rounded-lg border border-border p-3">
              <TextInput
                value={novoNome}
                onChangeText={setNovoNome}
                placeholder="Ex: Nubank"
                placeholderTextColor="#9BA1A6"
                className="text-base text-foreground"
              />
            </View>
          </View>
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">Taxa ao Mês (%)</Text>
            <View className="bg-background rounded-lg border border-border p-3">
              <TextInput
                value={novaTaxa}
                onChangeText={setNovaTaxa}
                placeholder="Ex: 1.75"
                placeholderTextColor="#9BA1A6"
                keyboardType="decimal-pad"
                className="text-base text-foreground"
              />
            </View>
          </View>
          <Pressable onPress={handleAdicionarBanco} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
            <View className="bg-blue-600 rounded-lg p-3 items-center">
              <Text className="text-base font-bold text-white">Adicionar Banco</Text>
            </View>
          </Pressable>
        </View>

        {/* Botão Salvar */}
        <Pressable onPress={handleSalvar} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
          <View className="bg-primary rounded-lg p-4 items-center mb-8">
            <Text className="text-lg font-bold text-white">✅ Salvar Alterações</Text>
          </View>
        </Pressable>

      </ScrollView>
    </ScreenContainer>
  );
}