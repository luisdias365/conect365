import { ScrollView, Text, View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { ScreenContainer } from '@/components/screen-container';
import { simulateAllBanks, formatCurrency } from '@/lib/banks';
import { useSimulationHistory } from '@/hooks/use-simulation-history';
import { SplashScreen } from '@/components/splash-screen';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { addToHistory } = useSimulationHistory();

  const [showSplash, setShowSplash] = useState(true);

  // Dados do cliente
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  // Dados do veículo
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [valorFipe, setValorFipe] = useState('');

  // Dados do financiamento
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [perfilCredito, setPerfilCredito] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }
// Formatar CPF
  const handleCpfChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 3) formatted = cleaned.slice(0, 3) + '.' + cleaned.slice(3);
    if (cleaned.length > 6) formatted = cleaned.slice(0, 3) + '.' + cleaned.slice(3, 6) + '.' + cleaned.slice(6);
    if (cleaned.length > 9) formatted = cleaned.slice(0, 3) + '.' + cleaned.slice(3, 6) + '.' + cleaned.slice(6, 9) + '-' + cleaned.slice(9, 11);
    setCpf(formatted);
    setError('');
  };

  // Formatar data de nascimento
  const handleDataNascimentoChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    if (cleaned.length > 4) formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    setDataNascimento(formatted);

    if (cleaned.length === 8) {
      const dia = parseInt(cleaned.slice(0, 2));
      const mes = parseInt(cleaned.slice(2, 4)) - 1;
      const anoNasc = parseInt(cleaned.slice(4, 8));
      const hoje = new Date();
      const nascimento = new Date(anoNasc, mes, dia);
      const idade = hoje.getFullYear() - nascimento.getFullYear();

      if (idade < 18) setPerfilCredito('❌ Menor de idade');
      else if (idade < 25) setPerfilCredito('🟡 Jovem - Taxa +0.3%');
      else if (idade < 60) setPerfilCredito('🟢 Adulto - Taxa padrão');
      else setPerfilCredito('🟡 Sênior - Taxa +0.2%');
    }
    setError('');
  };

  const handleAnoChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    setAno(cleaned);
    setError('');
  };

  const handleValorFipeChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setValorFipe(cleaned);
    setAmount(cleaned);
    setError('');
  };

  const handleAmountChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setAmount(cleaned);
    setError('');
  };

  const handleMonthsChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setMonths(cleaned);
    setError('');
  };
const calcularAjusteTaxa = (): number => {
    if (!dataNascimento || dataNascimento.length < 10) return 0;
    const parts = dataNascimento.split('/');
    const idade = new Date().getFullYear() - parseInt(parts[2]);
    if (idade < 25) return 0.3;
    if (idade >= 60) return 0.2;
    return 0;
  };

  const validateInputs = (): boolean => {
    if (!cpf || cpf.replace(/\D/g, '').length < 11) {
      setError('CPF inválido');
      return false;
    }
    if (!dataNascimento || dataNascimento.length < 10) {
      setError('Data de nascimento inválida');
      return false;
    }
    if (!marca.trim()) {
      setError('Informe a marca do veículo');
      return false;
    }
    if (!modelo.trim()) {
      setError('Informe o modelo do veículo');
      return false;
    }
    if (!ano || parseInt(ano) < 1990 || parseInt(ano) > new Date().getFullYear() + 1) {
      setError('Ano inválido');
      return false;
    }
    if (!amount) {
      setError('Informe o valor do financiamento');
      return false;
    }
    const amountNum = parseFloat(amount);
    if (amountNum < 1000) {
      setError('Valor mínimo é R$ 1.000');
      return false;
    }
    if (amountNum > 1000000) {
      setError('Valor máximo é R$ 1.000.000');
      return false;
    }
    const monthsNum = parseInt(months, 10);
    if (monthsNum < 1 || monthsNum > 360) {
      setError('Prazo deve estar entre 1 e 360 meses');
      return false;
    }
    return true;
  };

  const handleSimulate = async () => {
    if (!validateInputs()) return;
    setIsLoading(true);
    try {
      const ajusteTaxa = calcularAjusteTaxa();
      const input = {
        amount: parseFloat(amount),
        months: parseInt(months, 10),
        taxaAjuste: ajusteTaxa,
      };
      const results = simulateAllBanks(input);
      const bestBank = results[0];
      const simulation = {
        id: `sim_${Date.now()}`,
        input: {
          ...input,
          cpf: cpf.replace(/\D/g, ''),
          dataNascimento,
          marca,
          modelo,
          ano: parseInt(ano),
          valorFipe: valorFipe ? parseFloat(valorFipe) : undefined,
          perfilCredito,
        },
        results,
        timestamp: new Date(),
        bestBankId: bestBank.bankId,
      };
      await addToHistory(simulation);
      router.push({
        pathname: '/results',
        params: { simulationId: simulation.id },
      });
    } catch (err) {
      setError('Erro ao simular. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const displayAmount = amount ? `R$ ${parseFloat(amount).toLocaleString('pt-BR')}` : '';
  const displayMonths = months ? `${months} meses` : '';
return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-between">

          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <View className="flex-1">
              <Text className="text-4xl font-bold text-foreground mb-2">Simulador</Text>
              <Text className="text-base text-muted">Compare financiamentos entre bancos</Text>
            </View>
            <View className="flex-row gap-2">
              <Pressable onPress={() => router.push('/history')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                <View className="bg-surface rounded-full p-3 border border-border">
                  <MaterialIcons name="history" size={24} color={colors.foreground} />
                </View>
              </Pressable>
              <Pressable onPress={() => router.push('/settings')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                <View className="bg-surface rounded-full p-3 border border-border">
                  <MaterialIcons name="settings" size={24} color={colors.foreground} />
                </View>
              </Pressable>
            </View>
          </View>

          <View className="gap-6 mb-8">

            {/* SEÇÃO: Dados do Cliente */}
            <View>
              <Text className="text-lg font-bold text-foreground mb-3">👤 Dados do Cliente</Text>
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">CPF</Text>
                <View className="bg-surface rounded-lg border border-border p-4">
                  <TextInput value={cpf} onChangeText={handleCpfChange} placeholder="000.000.000-00" placeholderTextColor="#9BA1A6" keyboardType="number-pad" className="text-xl font-bold text-foreground" maxLength={14} editable={!isLoading} />
                </View>
              </View>
              <View className="mb-2">
                <Text className="text-sm font-semibold text-foreground mb-2">Data de Nascimento</Text>
                <View className="bg-surface rounded-lg border border-border p-4">
                  <TextInput value={dataNascimento} onChangeText={handleDataNascimentoChange} placeholder="DD/MM/AAAA" placeholderTextColor="#9BA1A6" keyboardType="number-pad" className="text-xl font-bold text-foreground" maxLength={10} editable={!isLoading} />
                </View>
                {perfilCredito ? <Text className="text-sm font-semibold mt-2 text-primary">{perfilCredito}</Text> : null}
              </View>
            </View>

            {/* SEÇÃO: Dados do Veículo */}
            <View>
              <Text className="text-lg font-bold text-foreground mb-3">🚗 Dados do Veículo</Text>
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground mb-2">Marca</Text>
                  <View className="bg-surface rounded-lg border border-border p-4">
                    <TextInput value={marca} onChangeText={(t) => { setMarca(t); setError(''); }} placeholder="Ex: Toyota" placeholderTextColor="#9BA1A6" className="text-base font-bold text-foreground" editable={!isLoading} />
                  </View>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground mb-2">Modelo</Text>
                  <View className="bg-surface rounded-lg border border-border p-4">
                    <TextInput value={modelo} onChangeText={(t) => { setModelo(t); setError(''); }} placeholder="Ex: Corolla" placeholderTextColor="#9BA1A6" className="text-base font-bold text-foreground" editable={!isLoading} />
                  </View>
                </View>
              </View>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground mb-2">Ano</Text>
                  <View className="bg-surface rounded-lg border border-border p-4">
                    <TextInput value={ano} onChangeText={handleAnoChange} placeholder="2020" placeholderTextColor="#9BA1A6" keyboardType="number-pad" className="text-base font-bold text-foreground" maxLength={4} editable={!isLoading} />
                  </View>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground mb-2">Valor FIPE (R$)</Text>
                  <View className="bg-surface rounded-lg border border-border p-4">
                    <TextInput value={valorFipe} onChangeText={handleValorFipeChange} placeholder="0" placeholderTextColor="#9BA1A6" keyboardType="number-pad" className="text-base font-bold text-foreground" editable={!isLoading} />
                  </View>
                </View>
              </View>
            </View>

            {/* SEÇÃO: Financiamento */}
            <View>
              <Text className="text-lg font-bold text-foreground mb-3">💰 Financiamento</Text>
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">Valor do Financiamento</Text>
                <View className="bg-surface rounded-lg border border-border p-4">
                  <TextInput value={amount} onChangeText={handleAmountChange} placeholder="0" placeholderTextColor="#9BA1A6" keyboardType="number-pad" className="text-2xl font-bold text-foreground" editable={!isLoading} />
                  {displayAmount ? <Text className="text-sm text-primary font-semibold mt-2">{displayAmount}</Text> : null}
                </View>
                <Text className="text-xs text-muted mt-2">Mínimo: R$ 1.000 | Máximo: R$ 1.000.000</Text>
              </View>
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">Prazo (em meses)</Text>
                <View className="bg-surface rounded-lg border border-border p-4">
                  <TextInput value={months} onChangeText={handleMonthsChange} placeholder="0" placeholderTextColor="#9BA1A6" keyboardType="number-pad" className="text-2xl font-bold text-foreground" editable={!isLoading} />
                  {displayMonths ? <Text className="text-sm text-primary font-semibold mt-2">{displayMonths}</Text> : null}
                </View>
                <Text className="text-xs text-muted mt-2">Mínimo: 1 mês | Máximo: 360 meses (30 anos)</Text>
              </View>
            </View>

            {error ? (
              <View className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <Text className="text-sm text-red-600 dark:text-red-200">{error}</Text>
              </View>
            ) : null}
          </View>

          <Pressable onPress={handleSimulate} disabled={isLoading} style={({ pressed }) => [{ opacity: pressed || isLoading ? 0.8 : 1 }]}>
            <View className="bg-primary rounded-lg p-4 flex-row items-center justify-center gap-2">
              {isLoading && <ActivityIndicator color="#fff" size="small" />}
              <Text className="text-lg font-bold text-white">{isLoading ? 'Simulando...' : 'Simular Financiamento'}</Text>
            </View>
          </Pressable>

          <View className="mt-8 pt-6 border-t border-border">
            <Text className="text-xs text-muted text-center">As taxas são aproximadas para demonstração. Consulte o banco para taxas atualizadas.</Text>
          </View>

        </View>
      </ScrollView>
    </ScreenContainer>
  );
}