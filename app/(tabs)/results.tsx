import { ScrollView, Text, View, Pressable, Share, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { BankResultCard } from '@/components/bank-result-card';
import { SimulationResult, BankResult } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/banks';

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);

  useMemo(() => {
    if (params.simulationData && typeof params.simulationData === 'string') {
      try {
        const data = JSON.parse(params.simulationData) as SimulationResult;
        data.timestamp = new Date(data.timestamp);
        setSimulation(data);
      } catch (error) {
        console.error('Erro ao parsear simulação:', error);
      }
    }
  }, [params.simulationData]);

  if (!simulation) {
    return (
      <ScreenContainer className="p-4 justify-center items-center">
        <Text className="text-foreground">Carregando resultados...</Text>
      </ScreenContainer>
    );
  }

  const bestBank = simulation.results[0];
  const savings = simulation.results[simulation.results.length - 1].totalAmount - bestBank.totalAmount;

  const handleShare = async () => {
    try {
      const message = `Simulei um financiamento de ${formatCurrency(simulation.input.amount)} em ${simulation.input.months} meses.\n\nMelhor taxa: ${bestBank.bankName} - ${formatPercentage(bestBank.monthlyRate)}\nParcela: ${formatCurrency(bestBank.monthlyPayment)}\nTotal: ${formatCurrency(bestBank.totalAmount)}\n\nEconomia comparado ao pior: ${formatCurrency(savings)}`;
      
      await Share.share({
        message,
        title: 'Resultado da Simulação de Financiamento',
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const handleBankPress = (result: BankResult) => {
    router.push({
      pathname: '/(tabs)/bank-detail',
      params: {
        bankId: result.bankId,
        bankName: result.bankName,
        monthlyRate: result.monthlyRate.toString(),
        simulationData: JSON.stringify(simulation),
      },
    });
  };

  const handleNewSimulation = () => {
    router.replace('/');
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com melhor resultado */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground mb-4">Resultados da Simulação</Text>

          {/* Card do melhor banco */}
          <View className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-xl p-6 border border-green-300 dark:border-green-700 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-semibold text-green-600 dark:text-green-400">MELHOR TAXA</Text>
              <View className="bg-green-500 rounded-full px-3 py-1">
                <Text className="text-xs font-bold text-white">#1</Text>
              </View>
            </View>

            <Text className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">
              {bestBank.bankName}
            </Text>

            <View className="gap-3 mt-4">
              <View className="flex-row justify-between">
                <Text className="text-sm text-green-600 dark:text-green-400">Taxa Mensal</Text>
                <Text className="text-lg font-bold text-green-700 dark:text-green-300">
                  {formatPercentage(bestBank.monthlyRate)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-green-600 dark:text-green-400">Parcela</Text>
                <Text className="text-lg font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(bestBank.monthlyPayment)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-green-600 dark:text-green-400">Total</Text>
                <Text className="text-lg font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(bestBank.totalAmount)}
                </Text>
              </View>
            </View>

            {savings > 0 && (
              <View className="mt-4 pt-4 border-t border-green-300 dark:border-green-700">
                <Text className="text-xs text-green-600 dark:text-green-400 mb-1">Economia vs. pior taxa</Text>
                <Text className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(savings)}
                </Text>
              </View>
            )}
          </View>

          {/* Resumo da simulação */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-muted">Valor Financiado</Text>
              <Text className="text-sm font-semibold text-foreground">
                {formatCurrency(simulation.input.amount)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Prazo</Text>
              <Text className="text-sm font-semibold text-foreground">
                {simulation.input.months} meses
              </Text>
            </View>
          </View>
        </View>

        {/* Lista de resultados */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Comparação de Bancos</Text>
          {simulation.results.map((result, index) => (
            <BankResultCard
              key={result.bankId}
              result={result}
              isBest={index === 0}
              rank={index + 1}
              onPress={() => handleBankPress(result)}
            />
          ))}
        </View>

        {/* Botões de ação */}
        <View className="gap-3 mb-6">
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <View className="bg-primary rounded-lg p-4 flex-row items-center justify-center">
              <Text className="text-base font-bold text-white">Compartilhar Resultado</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleNewSimulation}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <View className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-center">
              <Text className="text-base font-bold text-foreground">Nova Simulação</Text>
            </View>
          </Pressable>
        </View>

        {/* Disclaimer */}
        <View className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-4">
          <Text className="text-xs text-yellow-700 dark:text-yellow-200">
            As taxas são aproximadas para demonstração. Consulte o banco para informações atualizadas e condições específicas.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
