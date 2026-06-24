/**
 * Tipos compartilhados do aplicativo de simulação de financiamento
 */

export interface Bank {
  id: string;
  name: string;
  monthlyRate: number; // Taxa mensal em percentual (ex: 1.5 para 1.5%)
  color: string; // Cor para visualização
}

export interface SimulationInput {
  amount: number; // Valor do financiamento em reais
  months: number; // Prazo em meses
}

export interface BankResult {
  bankId: string;
  bankName: string;
  monthlyRate: number;
  monthlyPayment: number; // Valor da parcela mensal
  totalAmount: number; // Valor total a pagar (principal + juros)
  totalInterest: number; // Total de juros
}

export interface SimulationResult {
  id: string;
  input: SimulationInput;
  results: BankResult[];
  timestamp: Date;
  bestBankId: string; // ID do banco com melhor taxa
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}
