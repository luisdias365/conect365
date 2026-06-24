import { ScrollView, Text, View, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { SimulationResult, BankResult } from '@/lib/types';
import { formatCurrency, formatPercentage, generateAmortizationSchedule, getBankById } from '@/lib/banks';

export default function BankDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [bankResult, setBankResult] = useState<BankResult | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  useMemo(() => {
    if (params.simulationData && typeof params.simulationData === 'string') {
      try {
        const data = JSON.parse(params.simulationData) as SimulationResult;
        data.timestamp = new Date(data.timestamp);
        setSimulation(data);

        const result = data.results.find((r) => r.bankId === params.bankId);
        if (result) {
          setBankResult(result);
        }
      } catch (error) {
        console.error('Erro ao parsear simulação:', error);
      }
    }
  }, [params.simulationData, params.bankId]);

  if (!simulation || !bankResult) {
    return (
      <ScreenContainer className="p-4 justify-center items-center">
        <Text className="text-foreground">Carregando detalhes...</Text>
      </ScreenContainer>
    );
  }

  const bank = getBankById(bankResult.bankId);
  const schedule = generateAmortizationSchedule(
    simulation.input.amount,
    bankResult.monthlyRate,
    bankResult.monthlyPayment,
    simulation.input.months
  );

  const displaySchedule = showFullSchedule ? schedule : schedule.slice(0, 5);
  const hasMore = schedule.length > 5;

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <Text className="text-primary font-semibold mb-4">← Voltar</Text>
        </Pressable>

        {/* Informações do Banco */}
        <View className="bg-surface rounded-lg p-6 border border-border mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">{bankResult.bankName}</Text>
          <Text className="text-5xl font-bold text-primary mb-4">
            {formatPercentage(bankResult.monthlyRate)}
          </Text>
          <Text className="text-sm text-muted">Taxa de juros mensal</Text>
        </View>

        {/* Resumo da Simulação */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Resumo da Simulação</Text>
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <View className="flex-row justify-between pb-3 border-b border-border">
              <Text className="text-sm text-muted">Valor Financiado</Text>
              <Text className="text-sm font-semibold text-foreground">
                {formatCurrency(simulation.input.amount)}
              </Text>
            </View>
            <View className="flex-row justify-between pb-3 border-b border-border">
              <Text className="text-sm text-muted">Prazo</Text>
              <Text className="text-sm font-semibold text-foreground">
                {simulation.input.months} meses
              </Text>
            </View>
            <View className="flex-row justify-between pb-3 border-b border-border">
              <Text className="text-sm text-muted">Parcela Mensal</Text>
              <Text className="text-sm font-semibold text-foreground">
                {formatCurrency(bankResult.monthlyPayment)}
              </Text>
            </View>
            <View className="flex-row justify-between pb-3 border-b border-border">
              <Text className="text-sm text-muted">Total de Juros</Text>
              <Text className="text-sm font-semibold text-foreground">
                {formatCurrency(bankResult.totalInterest)}
              </Text>
            </View>
            <View className="flex-row justify-between pt-3">
              <Text className="text-sm font-semibold text-foreground">Total a Pagar</Text>
              <Text className="text-lg font-bold text-primary">
                {formatCurrency(bankResult.totalAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabela de Amortização */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Tabela de Amortização</Text>
          <View className="bg-surface rounded-lg border border-border overflow-hidden">
            {/* Header da tabela */}
            <View className="bg-primary p-3 flex-row">
              <Text className="text-white font-bold flex-1 text-xs">Mês</Text>
              <Text className="text-white font-bold flex-1 text-xs">Parcela</Text>
              <Text className="text-white font-bold flex-1 text-xs">Principal</Text>
              <Text className="text-white font-bold flex-1 text-xs">Juros</Text>
            </View>

            {/* Linhas da tabela */}
            {displaySchedule.map((entry, index) => (
              <View
                key={entry.month}
                className={`flex-row p-3 border-b border-border ${
                  index % 2 === 0 ? 'bg-surface' : 'bg-muted/5'
                }`}
              >
                <Text className="text-xs text-foreground flex-1 font-semibold">
                  {entry.month}
                </Text>
                <Text className="text-xs text-foreground flex-1">
                  {formatCurrency(entry.payment)}
                </Text>
                <Text className="text-xs text-foreground flex-1">
                  {formatCurrency(entry.principal)}
                </Text>
                <Text className="text-xs text-foreground flex-1">
                  {formatCurrency(entry.interest)}
                </Text>
              </View>
            ))}

            {/* Botão para expandir */}
            {hasMore && !showFullSchedule && (
              <Pressable
                onPress={() => setShowFullSchedule(true)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="p-3 bg-muted/10 items-center">
                  <Text className="text-sm font-semibold text-primary">
                    Ver {schedule.length - 5} parcelas restantes
                  </Text>
                </View>
              </Pressable>
            )}

            {showFullSchedule && hasMore && (
              <Pressable
                onPress={() => setShowFullSchedule(false)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="p-3 bg-muted/10 items-center">
                  <Text className="text-sm font-semibold text-primary">Recolher tabela</Text>
                </View>
              </Pressable>
            )}
          </View>
        </View>

        {/* Disclaimer */}
        <View className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-6">
          <Text className="text-xs text-yellow-700 dark:text-yellow-200">
            Valores aproximados para demonstração. Consulte o banco para informações atualizadas, taxas específicas e condições de aprovação.
          </Text>
        </View>

        {/* Botão de voltar */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        >
          <View className="bg-surface border border-border rounded-lg p-4 items-center">
            <Text className="text-base font-bold text-foreground">Voltar aos Resultados</Text>
          </View>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
