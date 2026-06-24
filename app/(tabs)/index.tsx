import { ScrollView, Text, View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { ScreenContainer } from '@/components/screen-container';
import { simulateAllBanks, formatCurrency } from '@/lib/banks';
import { SimulationInput, SimulationResult } from '@/lib/types';
import { useSimulationHistory } from '@/hooks/use-simulation-history';
import { SplashScreen } from '@/components/splash-screen';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { addToHistory } = useSimulationHistory();
  
  const [showSplash, setShowSplash] = useState(true);
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hide splash screen after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const handleAmountChange = (text: string) => {
    // Remove caracteres não numéricos
    const cleaned = text.replace(/\D/g, '');
    setAmount(cleaned);
    setError('');
  };

  const handleMonthsChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setMonths(cleaned);
    setError('');
  };

  const validateInputs = (): boolean => {
    if (!amount || !months) {
      setError('Preencha todos os campos');
      return false;
    }

    const amountNum = parseFloat(amount);
    const monthsNum = parseInt(months, 10);

    if (amountNum < 1000) {
      setError('Valor mínimo é R$ 1.000');
      return false;
    }

    if (amountNum > 1000000) {
      setError('Valor máximo é R$ 1.000.000');
      return false;
    }

    if (monthsNum < 1 || monthsNum > 360) {
      setError('Prazo deve estar entre 1 e 360 meses');
      return false;
    }

    return true;
  };

  const handleSimulate = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      const input: SimulationInput = {
        amount: parseFloat(amount),
        months: parseInt(months, 10),
      };

      const results = simulateAllBanks(input);
      const bestBank = results[0]; // Já está ordenado por taxa

      const simulation: SimulationResult = {
        id: `sim_${Date.now()}`,
        input,
        results,
        timestamp: new Date(),
        bestBankId: bestBank.bankId,
      };

      await addToHistory(simulation);

      // Navega para a tela de resultados
      router.push({
        pathname: '/results',
        params: {
          simulationId: simulation.id,
          simulationData: JSON.stringify(simulation),
        },
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
          {/* Header com botões */}
          <View className="flex-row items-center justify-between mb-8">
            <View className="flex-1">
              <Text className="text-4xl font-bold text-foreground mb-2">Simulador</Text>
              <Text className="text-base text-muted">
                Compare financiamentos entre bancos
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => router.push('/history')}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="bg-surface rounded-full p-3 border border-border">
                  <MaterialIcons name="history" size={24} color={colors.foreground} />
                </View>
              </Pressable>
              <Pressable
                onPress={() => router.push('/settings')}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="bg-surface rounded-full p-3 border border-border">
                  <MaterialIcons name="settings" size={24} color={colors.foreground} />
                </View>
              </Pressable>
            </View>
          </View>

          {/* Form */}
          <View className="gap-6 mb-8">
            {/* Valor do Financiamento */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Valor do Financiamento</Text>
              <View className="bg-surface rounded-lg border border-border p-4">
                <Text className="text-xs text-muted mb-2">Digite o valor</Text>
                <TextInput
                  value={amount}
                  onChangeText={handleAmountChange}
                  placeholder="0"
                  placeholderTextColor="#9BA1A6"
                  keyboardType="number-pad"
                  className="text-2xl font-bold text-foreground"
                  editable={!isLoading}
                />
                {displayAmount && (
                  <Text className="text-sm text-primary font-semibold mt-2">{displayAmount}</Text>
                )}
              </View>
              <Text className="text-xs text-muted mt-2">Mínimo: R$ 1.000 | Máximo: R$ 1.000.000</Text>
            </View>

            {/* Prazo em Meses */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Prazo (em meses)</Text>
              <View className="bg-surface rounded-lg border border-border p-4">
                <Text className="text-xs text-muted mb-2">Digite o prazo</Text>
                <TextInput
                  value={months}
                  onChangeText={handleMonthsChange}
                  placeholder="0"
                  placeholderTextColor="#9BA1A6"
                  keyboardType="number-pad"
                  className="text-2xl font-bold text-foreground"
                  editable={!isLoading}
                />
                {displayMonths && (
                  <Text className="text-sm text-primary font-semibold mt-2">{displayMonths}</Text>
                )}
              </View>
              <Text className="text-xs text-muted mt-2">Mínimo: 1 mês | Máximo: 360 meses (30 anos)</Text>
            </View>

            {/* Erro */}
            {error && (
              <View className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <Text className="text-sm text-red-600 dark:text-red-200">{error}</Text>
              </View>
            )}
          </View>

          {/* Botão Simular */}
          <Pressable
            onPress={handleSimulate}
            disabled={isLoading}
            style={({ pressed }) => [
              {
                opacity: pressed || isLoading ? 0.8 : 1,
              },
            ]}
          >
            <View className="bg-primary rounded-lg p-4 flex-row items-center justify-center gap-2">
              {isLoading && <ActivityIndicator color="#fff" size="small" />}
              <Text className="text-lg font-bold text-white">
                {isLoading ? 'Simulando...' : 'Simular Financiamento'}
              </Text>
            </View>
          </Pressable>

          {/* Info Footer */}
          <View className="mt-8 pt-6 border-t border-border">
            <Text className="text-xs text-muted text-center">
              As taxas são aproximadas para demonstração. Consulte o banco para taxas atualizadas.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
