import { ScrollView, Text, View, Pressable, FlatList } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useSimulationHistory } from '@/hooks/use-simulation-history';
import { SimulationResult } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/banks';

export default function HistoryScreen() {
  const router = useRouter();
  const { history, clearHistory, removeFromHistory } = useSimulationHistory();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 300);
    }, [])
  );

  const handleItemPress = (simulation: SimulationResult) => {
    router.push({
      pathname: '/results',
      params: {
        simulationId: simulation.id,
        simulationData: JSON.stringify(simulation),
      },
    });
  };

  const handleDelete = async (id: string) => {
    await removeFromHistory(id);
  };

  const handleClearAll = async () => {
    if (history.length > 0) {
      await clearHistory();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <ScreenContainer className="p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-2xl font-bold text-foreground">Histórico</Text>
          <Text className="text-sm text-muted">
            {history.length} simulação{history.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <Text className="text-primary font-semibold">Fechar</Text>
        </Pressable>
      </View>

      {history.length === 0 ? (
        <View className="flex-1 justify-center items-center py-12">
          <Text className="text-lg font-semibold text-foreground mb-2">Nenhuma simulação ainda</Text>
          <Text className="text-sm text-muted text-center">
            Suas simulações aparecerão aqui para fácil acesso
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const bestBank = item.results[0];
              return (
                <Pressable
                  onPress={() => handleItemPress(item)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-foreground mb-1">
                          {formatCurrency(item.input.amount)} • {item.input.months} meses
                        </Text>
                        <Text className="text-xs text-muted">{formatDate(item.timestamp)}</Text>
                      </View>
                      <Pressable
                        onPress={() => handleDelete(item.id)}
                        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                      >
                        <Text className="text-red-500 font-semibold text-sm">Deletar</Text>
                      </Pressable>
                    </View>

                    <View className="bg-muted/10 rounded p-2">
                      <View className="flex-row justify-between items-center">
                        <View>
                          <Text className="text-xs text-muted mb-1">Melhor taxa</Text>
                          <Text className="text-sm font-bold text-foreground">
                            {bestBank.bankName}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text className="text-xs text-muted mb-1">Taxa</Text>
                          <Text className="text-sm font-bold text-primary">
                            {formatPercentage(bestBank.monthlyRate)}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text className="text-xs text-muted mb-1">Parcela</Text>
                          <Text className="text-sm font-bold text-foreground">
                            {formatCurrency(bestBank.monthlyPayment)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            }}
          />

          {/* Botão Limpar Histórico */}
          <Pressable
            onPress={handleClearAll}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <View className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 items-center mt-4">
              <Text className="text-base font-bold text-red-600 dark:text-red-200">
                Limpar Histórico
              </Text>
            </View>
          </Pressable>
        </>
      )}
    </ScreenContainer>
  );
}
