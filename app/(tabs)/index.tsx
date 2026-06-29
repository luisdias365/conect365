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
  const [perfilCredito, setPerfilCredito] = useState('');
  const [perfilDetalhado, setPerfilDetalhado] = useState('');
  const [entradaSugerida, setEntradaSugerida] = useState('');

  // Dados do veículo
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [valorFipe, setValorFipe] = useState('');
  const [taxaRetorno, setTaxaRetorno] = useState('');

  // Dados do financiamento
  const [months, setMonths] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }
const calcularEntradaSugerida = (fipe: string, nascimento: string) => {
    if (!fipe || !nascimento || nascimento.length < 10) return;
    const parts = nascimento.split('/');
    if (parts.length < 3) return;
    const idade = new Date().getFullYear() - parseInt(parts[2]);
    const valorFipeNum = parseFloat(fipe);

    if (idade < 18) {
      setPerfilCredito('❌ Menor de idade');
      setPerfilDetalhado('');
      setEntradaSugerida('');
    } else if (idade < 25) {
      setPerfilCredito('🟡 Jovem - Taxa +0.3%');
      setPerfilDetalhado('Entrada sugerida: 30% | Bancos recomendados: Caixa, Banco do Brasil');
      setEntradaSugerida(String(Math.round(valorFipeNum * 0.30)));
    } else if (idade < 60) {
      setPerfilCredito('🟢 Adulto - Taxa padrão');
      setPerfilDetalhado('Entrada sugerida: 20% | Bancos recomendados: Itaú, Bradesco, Santander');
      setEntradaSugerida(String(Math.round(valorFipeNum * 0.20)));
    } else {
      setPerfilCredito('🟡 Sênior - Taxa +0.2%');
      setPerfilDetalhado('Entrada sugerida: 25% | Bancos recomendados: Caixa, Sicredi');
      setEntradaSugerida(String(Math.round(valorFipeNum * 0.25)));
    }
  };

  const handleCpfChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 3) formatted = cleaned.slice(0, 3) + '.' + cleaned.slice(3);
    if (cleaned.length > 6) formatted = cleaned.slice(0, 3) + '.' + cleaned.slice(3, 6) + '.' + cleaned.slice(6);
    if (cleaned.length > 9) formatted = cleaned.slice(0, 3) + '.' + cleaned.slice(3, 6) + '.' + cleaned.slice(6, 9) + '-' + cleaned.slice(9, 11);
    setCpf(formatted);
    setError('');
  };

  const handleDataNascimentoChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    if (cleaned.length > 4) formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    setDataNascimento(formatted);
    if (cleaned.length === 8) {
      calcularEntradaSugerida(valorFipe, formatted);
    }
    setError('');
  };

  const handlePlacaChange = (text: string) => {
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 3) formatted = cleaned.slice(0, 3) + '-' + cleaned.slice(3, 7);
    setPlaca(formatted);
    setError('');
  };

  const handleValorFipeChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setValorFipe(cleaned);
    const retorno = parseFloat(taxaRetorno) || 0;
    calcularEntradaSugerida(cleaned, dataNascimento);
    setError('');
  };

  const handleTaxaRetornoChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    setTaxaRetorno(cleaned);
    setError('');
  };

  const handleAnoChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    setAno(cleaned);
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
    if (!valorFipe) {
      setError('Informe o valor FIPE do veículo');
      return false;
    }
    if (!months || parseInt(months) < 1 || parseInt(months) > 360) {
      setError('Prazo deve estar entre 1 e 360 meses');
      return false;
    }
    return true;
  };

  const handleSimulate = async (usarEntradaSugerida: boolean) => {
    if (!validateInputs()) return;
    setIsLoading(true);
    try {
      const ajusteTaxa = calcularAjusteTaxa();
      const retorno = parseFloat(taxaRetorno) || 0;
      const valorComRetorno = Math.round(parseFloat(valorFipe) * (1 + retorno / 100));
      const entrada = usarEntradaSugerida && entradaSugerida ? parseFloat(entradaSugerida) : 0;
      const valorFinanciado = valorComRetorno - entrada;

      const input = {
        amount: valorFinanciado,
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
          valorFipe: parseFloat(valorFipe),
          valorComRetorno,
          entrada,
          taxaRetorno: retorno,
          perfilCredito,
          placa,
          usarEntradaSugerida,
        },
        results,
        timestamp: new Date(),
        bestBankId: bestBank.bankId,
      };
      await addToHistory(simulation);
      router.push({
        pathname: '/results',
        params: { simulationData: JSON.stringify(simulation) },
      });
    } catch (err) {
      setError('Erro ao simular. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const valorComRetorno = valorFipe && taxaRetorno
    ? Math.round(parseFloat(valorFipe) * (1 + parseFloat(taxaRetorno) / 100))
    : valorFipe ? parseFloat(valorFipe) : 0;

  const valorSemEntrada = valorComRetorno;
  const valorComEntrada = entradaSugerida ? valorComRetorno - parseFloat(entradaSugerida) : valorComRetorno;
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
              <Pressable onPress={() => router.push('/admin')} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
  <View className="bg-surface rounded-full p-3 border border-border">
    <MaterialIcons name="admin-panel-settings" size={24} color={colors.foreground} />
  </View>
</Pressable>
            </View>
          </View>

          <View className="gap-6 mb-8">

            {/* SEÇÃO: Dados do Veículo */}
            <View>
              <Text className="text-lg font-bold text-foreground mb-3">🚗 Dados do Veículo</Text>

              {/* Valor FIPE PRIMEIRO */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">Valor FIPE (R$)</Text>
                <View className="bg-surface rounded-lg border border-border p-4">
                  <TextInput value={valorFipe} onChangeText={handleValorFipeChange} placeholder="Ex: 50000" placeholderTextColor="#9BA1A6" keyboardType="number-pad" className="text-2xl font-bold text-foreground" editable={!isLoading} />
                </View>
                {valorFipe ? <Text className="text-sm text-primary font-semibold mt-2">R$ {parseFloat(valorFipe).toLocaleString('pt-BR')}</Text> : null}
              </View>

              {/* Placa */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">Placa</Text>
                <View className="bg-surface rounded-lg border border-border p-4">
                  <TextInput value={placa} onChangeText={handlePlacaChange} placeholder="ABC-1234" placeholderTextColor="#9BA1A6" className="text-xl font-bold text-foreground" maxLength={8} autoCapitalize="characters" editable={!isLoading} />
                </View>
              </View>

              {/* Marca e Modelo */}
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground mb-2">Marca</Text>
                  <View className="bg-surface rounded-lg border border-border p-4">
                    <TextInput value={marca} onChangeText={(t) => { setMarca(t); setError(''); }} placeholder="Ex: Chevrolet" placeholderTextColor="#9BA1A6" className="text-base font-bold text-foreground" editable={!isLoading} />
                  </View>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground mb-2">Modelo</Text>
                  <View className="bg-surface rounded-lg border border-border p-4">
                    <TextInput value={modelo} onChangeText={(t) => { setModelo(t); setError(''); }} placeholder="Ex: Onix" placeholderTextColor="#9BA1A6" className="text-base font-bold text-foreground" editable={!isLoading} />
                  </View>
                </View>
              </View>

              {/* Ano */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">Ano</Text>
                <View className="bg-surface rounded-lg border border-border p-4">
                  <TextInput value={ano} onChangeText={handleAnoChange} placeholder="2020" placeholderTextColor="#9BA1A6" keyboardType="number-pad" className="text-base font-bold text-foreground" maxLength={4} editable={!isLoading} />
                </View>
              </View>

              {/* Taxa de Retorno */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">Taxa de Retorno da Loja (%)</Text>
                <View className="bg-surface rounded-lg border border-border p-4">
                  <TextInput value={taxaRetorno} onChangeText={handleTaxaRetornoChange} placeholder="Ex: 2.5" placeholderTextColor="#9BA1A6" keyboardType="decimal-pad" className="text-base font-bold text-foreground" editable={!isLoading} />
                </View>
                {taxaRetorno && valorFipe ? (
                  <Text className="text-sm text-primary font-semibold mt-2">
                    Valor com retorno: R$ {valorComRetorno.toLocaleString('pt-BR')}
                  </Text>
                ) : null}
              </View>
            </View>
{/* SEÇÃO: Dados do Cliente */}
            <View>
              <Text className="text-lg font-bold text-foreground mb-3">👤 Dados do Cliente</Text>

              {/* CPF */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">CPF</Text>
                <View className="bg-surface rounded-lg border border-border p-4">
                  <TextInput value={cpf} onChangeText={handleCpfChange} placeholder="000.000.000-00" placeholderTextColor="#9BA1A6" keyboardType="number-pad" className="text-xl font-bold text-foreground" maxLength={14} editable={!isLoading} />
                </View>
              </View>

              {/* Data de Nascimento */}
              <View className="mb-2">
                <Text className="text-sm font-semibold text-foreground mb-2">Data de Nascimento</Text>
                <View className="bg-surface rounded-lg border border-border p-4">
                  <TextInput value={dataNascimento} onChangeText={handleDataNascimentoChange} placeholder="DD/MM/AAAA" placeholderTextColor="#9BA1A6" keyboardType="number-pad" className="text-xl font-bold text-foreground" maxLength={10} editable={!isLoading} />
                </View>
                {perfilCredito ? <Text className="text-sm font-semibold mt-2 text-primary">{perfilCredito}</Text> : null}
              </View>

              {/* Entrada Sugerida */}
              {entradaSugerida ? (
                <View className="mt-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                  <Text className="text-sm font-bold text-blue-700 dark:text-blue-200 mb-1">💡 Entrada Sugerida para seu Perfil</Text>
                  <Text className="text-lg font-bold text-blue-800 dark:text-blue-100">
                    R$ {parseFloat(entradaSugerida).toLocaleString('pt-BR')}
                  </Text>
                  <Text className="text-xs text-blue-600 dark:text-blue-300 mt-1">{perfilDetalhado}</Text>
                </View>
              ) : null}
            </View>

            {/* SEÇÃO: Prazo */}
            <View>
              <Text className="text-lg font-bold text-foreground mb-3">📅 Prazo</Text>
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">Número de meses</Text>
                <View className="bg-surface rounded-lg border border-border p-4">
                  <TextInput value={months} onChangeText={handleMonthsChange} placeholder="Ex: 48" placeholderTextColor="#9BA1A6" keyboardType="number-pad" className="text-2xl font-bold text-foreground" editable={!isLoading} />
                  {displayMonths ? <Text className="text-sm text-primary font-semibold mt-2">{displayMonths}</Text> : null}
                </View>
                <Text className="text-xs text-muted mt-2">Mínimo: 1 mês | Máximo: 360 meses (30 anos)</Text>
              </View>
            </View>

            {/* Resumo dos valores */}
            {valorFipe && months ? (
              <View className="bg-surface rounded-lg border border-border p-4 gap-2">
                <Text className="text-sm font-bold text-foreground mb-1">📊 Resumo da Simulação</Text>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Valor FIPE</Text>
                  <Text className="text-sm font-semibold text-foreground">R$ {parseFloat(valorFipe).toLocaleString('pt-BR')}</Text>
                </View>
                {taxaRetorno ? (
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Com retorno ({taxaRetorno}%)</Text>
                    <Text className="text-sm font-semibold text-foreground">R$ {valorComRetorno.toLocaleString('pt-BR')}</Text>
                  </View>
                ) : null}
                {entradaSugerida ? (
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Entrada sugerida</Text>
                    <Text className="text-sm font-semibold text-blue-600">- R$ {parseFloat(entradaSugerida).toLocaleString('pt-BR')}</Text>
                  </View>
                ) : null}
                <View className="flex-row justify-between border-t border-border pt-2 mt-1">
                  <Text className="text-sm font-bold text-foreground">Valor a financiar (sem entrada)</Text>
                  <Text className="text-sm font-bold text-foreground">R$ {valorSemEntrada.toLocaleString('pt-BR')}</Text>
                </View>
                {entradaSugerida ? (
                  <View className="flex-row justify-between">
                    <Text className="text-sm font-bold text-primary">Valor a financiar (com entrada)</Text>
                    <Text className="text-sm font-bold text-primary">R$ {valorComEntrada.toLocaleString('pt-BR')}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            {/* Erro */}
            {error ? (
              <View className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <Text className="text-sm text-red-600 dark:text-red-200">{error}</Text>
              </View>
            ) : null}
          </View>

          {/* Botões de Simulação */}
          <View className="gap-3">
            <Pressable onPress={() => handleSimulate(false)} disabled={isLoading} style={({ pressed }) => [{ opacity: pressed || isLoading ? 0.8 : 1 }]}>
              <View className="bg-primary rounded-lg p-4 flex-row items-center justify-center gap-2">
                {isLoading && <ActivityIndicator color="#fff" size="small" />}
                <Text className="text-lg font-bold text-white">{isLoading ? 'Simulando...' : '💰 Simular Valor Total'}</Text>
              </View>
            </Pressable>

            {entradaSugerida ? (
              <Pressable onPress={() => handleSimulate(true)} disabled={isLoading} style={({ pressed }) => [{ opacity: pressed || isLoading ? 0.8 : 1 }]}>
                <View className="bg-blue-600 rounded-lg p-4 flex-row items-center justify-center gap-2">
                  {isLoading && <ActivityIndicator color="#fff" size="small" />}
                  <Text className="text-lg font-bold text-white">{isLoading ? 'Simulando...' : '✅ Simular com Entrada Sugerida'}</Text>
                </View>
              </Pressable>
            ) : null}
          </View>

          {/* Footer */}
          <View className="mt-8 pt-6 border-t border-border">
            <Text className="text-xs text-muted text-center">As taxas são aproximadas para demonstração. Consulte o banco para taxas atualizadas.</Text>
          </View>

        </View>
      </ScrollView>
    </ScreenContainer>
  );
}