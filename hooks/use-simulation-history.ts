import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SimulationResult } from '@/lib/types';

const HISTORY_KEY = '@simulador_financiamento:history';
const MAX_HISTORY_ITEMS = 50;

export function useSimulationHistory() {
  const [history, setHistory] = useState<SimulationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega o histórico ao inicializar
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      if (data) {
        const parsed = JSON.parse(data) as SimulationResult[];
        // Converte strings de data de volta para objetos Date
        const withDates = parsed.map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setHistory(withDates);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToHistory = useCallback(async (simulation: SimulationResult) => {
    try {
      const updated = [simulation, ...history].slice(0, MAX_HISTORY_ITEMS);
      setHistory(updated);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao adicionar ao histórico:', error);
    }
  }, [history]);

  const clearHistory = useCallback(async () => {
    try {
      setHistory([]);
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  }, []);

  const removeFromHistory = useCallback(
    async (id: string) => {
      try {
        const updated = history.filter((item) => item.id !== id);
        setHistory(updated);
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Erro ao remover do histórico:', error);
      }
    },
    [history]
  );

  return {
    history,
    isLoading,
    addToHistory,
    clearHistory,
    removeFromHistory,
    loadHistory,
  };
}
