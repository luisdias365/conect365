import { View, Text, Pressable } from 'react-native';
import { BankResult } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/banks';
import { cn } from '@/lib/utils';

interface BankResultCardProps {
  result: BankResult;
  isBest: boolean;
  onPress?: () => void;
  rank?: number;
}

export function BankResultCard({ result, isBest, onPress, rank }: BankResultCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View
        className={cn(
          'rounded-lg p-4 mb-3 border',
          isBest
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 dark:from-green-900 dark:to-emerald-900 dark:border-green-700'
            : 'bg-surface border-border'
        )}
      >
        {/* Header com rank e badge */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            {rank && (
              <Text className="text-sm font-semibold text-muted">#{rank}</Text>
            )}
            <Text className="text-lg font-bold text-foreground flex-1">
              {result.bankName}
            </Text>
          </View>
          {isBest && (
            <View className="bg-green-500 rounded-full px-3 py-1">
              <Text className="text-xs font-bold text-white">Melhor Taxa</Text>
            </View>
          )}
        </View>

        {/* Taxa de juros */}
        <View className="mb-3">
          <Text className="text-xs text-muted mb-1">Taxa Mensal</Text>
          <Text className={cn('text-2xl font-bold', isBest ? 'text-green-600 dark:text-green-400' : 'text-foreground')}>
            {formatPercentage(result.monthlyRate)}
          </Text>
        </View>

        {/* Informações principais */}
        <View className="gap-2">
          <View className="flex-row justify-between">
            <Text className="text-sm text-muted">Parcela Mensal</Text>
            <Text className="text-sm font-semibold text-foreground">
              {formatCurrency(result.monthlyPayment)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-muted">Total com Juros</Text>
            <Text className="text-sm font-semibold text-foreground">
              {formatCurrency(result.totalAmount)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-muted">Juros Totais</Text>
            <Text className="text-sm font-semibold text-foreground">
              {formatCurrency(result.totalInterest)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
