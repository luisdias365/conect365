import { ScrollView, Text, View, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BANKS } from '@/lib/banks';

const SELECTED_BANKS_KEY = '@simulador_financiamento:selected_banks';

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [selectedBanks, setSelectedBanks] = useState<Set<string>>(
    new Set(BANKS.map((b) => b.id))
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSelectedBanks();
  }, []);

  const loadSelectedBanks = async () => {
    try {
      const data = await AsyncStorage.getItem(SELECTED_BANKS_KEY);
      if (data) {
        setSelectedBanks(new Set(JSON.parse(data)));
      }
    } catch (error) {
      console.error('Erro ao carregar bancos selecionados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBank = async (bankId: string) => {
    const updated = new Set(selectedBanks);
    if (updated.has(bankId)) {
      updated.delete(bankId);
    } else {
      updated.add(bankId);
    }
    setSelectedBanks(updated);

    try {
      await AsyncStorage.setItem(SELECTED_BANKS_KEY, JSON.stringify(Array.from(updated)));
    } catch (error) {
      console.error('Erro ao salvar bancos selecionados:', error);
    }
  };

  const selectAll = async () => {
    const allBanks = new Set(BANKS.map((b) => b.id));
    setSelectedBanks(allBanks);
    try {
      await AsyncStorage.setItem(SELECTED_BANKS_KEY, JSON.stringify(Array.from(allBanks)));
    } catch (error) {
      console.error('Erro ao salvar bancos selecionados:', error);
    }
  };

  const deselectAll = async () => {
    setSelectedBanks(new Set());
    try {
      await AsyncStorage.setItem(SELECTED_BANKS_KEY, JSON.stringify([]));
    } catch (error) {
      console.error('Erro ao salvar bancos selecionados:', error);
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-foreground">Configurações</Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className="text-primary font-semibold">Fechar</Text>
          </Pressable>
        </View>

        {/* Tema */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Aparência</Text>
          <View className="bg-surface rounded-lg p-4 border border-border">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-base font-semibold text-foreground">Tema</Text>
                <Text className="text-sm text-muted mt-1">
                  {colorScheme === 'dark' ? 'Escuro' : 'Claro'}
                </Text>
              </View>
              <Text className="text-sm text-muted">
                {colorScheme === 'dark' ? '🌙' : '☀️'}
              </Text>
            </View>
          </View>
        </View>

        {/* Bancos */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-foreground">Bancos</Text>
            <Text className="text-sm text-muted">
              {selectedBanks.size} de {BANKS.length}
            </Text>
          </View>

          {/* Botões de seleção rápida */}
          <View className="flex-row gap-2 mb-4">
            <Pressable
              onPress={selectAll}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View className="bg-primary rounded-lg px-4 py-2">
                <Text className="text-sm font-semibold text-white">Selecionar Todos</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={deselectAll}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View className="bg-surface border border-border rounded-lg px-4 py-2">
                <Text className="text-sm font-semibold text-foreground">Desselecionar</Text>
              </View>
            </Pressable>
          </View>

          {/* Lista de bancos */}
          <View className="bg-surface rounded-lg border border-border overflow-hidden">
            {BANKS.map((bank, index) => (
              <Pressable
                key={bank.id}
                onPress={() => toggleBank(bank.id)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View
                  className={`flex-row items-center justify-between p-4 ${
                    index !== BANKS.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: bank.color }}
                    />
                    <Text className="text-base font-medium text-foreground">
                      {bank.name}
                    </Text>
                  </View>
                  <View
                    className={`w-6 h-6 rounded border-2 items-center justify-center ${
                      selectedBanks.has(bank.id)
                        ? 'bg-primary border-primary'
                        : 'border-border'
                    }`}
                  >
                    {selectedBanks.has(bank.id) && (
                      <Text className="text-white text-sm font-bold">✓</Text>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Sobre */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Sobre</Text>
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Versão</Text>
              <Text className="text-sm font-semibold text-foreground">1.0.0</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Desenvolvido com</Text>
              <Text className="text-sm font-semibold text-foreground">React Native</Text>
            </View>
          </View>
        </View>

        {/* Disclaimer */}
        <View className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-6">
          <Text className="text-xs text-blue-700 dark:text-blue-200">
            Este aplicativo fornece simulações aproximadas. As taxas reais podem variar. Consulte os bancos para informações precisas e atualizadas.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
