import { Bank, BankResult, SimulationInput, AmortizationEntry } from './types';

/**
 * Lista de bancos com suas taxas mensais (valores aproximados para demonstração)
 * Em produção, essas taxas viriam de uma API
 */
export const BANKS: Bank[] = [
  {
    id: 'bb',
    name: 'Banco do Brasil',
    monthlyRate: 1.45,
    color: '#FFD700', // Amarelo
  },
  {
    id: 'caixa',
    name: 'Caixa Econômica',
    monthlyRate: 1.38,
    color: '#0066CC', // Azul
  },
  {
    id: 'bradesco',
    name: 'Bradesco',
    monthlyRate: 1.52,
    color: '#C41E3A', // Vermelho
  },
  {
    id: 'itau',
    name: 'Itaú',
    monthlyRate: 1.48,
    color: '#EC7000', // Laranja
  },
  {
    id: 'santander',
    name: 'Santander',
    monthlyRate: 1.55,
    color: '#FF0000', // Vermelho
  },
  {
    id: 'nubank',
    name: 'Nubank',
    monthlyRate: 1.99,
    color: '#7C3AED', // Roxo
  },
  {
    id: 'inter',
    name: 'Banco Inter',
    monthlyRate: 1.42,
    color: '#FF6B35', // Laranja avermelhado
  },
  {
    id: 'sicredi',
    name: 'Sicredi',
    monthlyRate: 1.35,
    color: '#00A651', // Verde
  },
  {
    id: 'bv',
    name: 'BV Financeira',
    monthlyRate: 1.58,
    color: '#1E90FF', // Azul Royal
  },
  {
    id: 'pan',
    name: 'Banco Pan',
    monthlyRate: 1.62,
    color: '#FF8C00', // Laranja escuro
  },
  {
    id: 'c6',
    name: 'Banco C6',
    monthlyRate: 1.41,
    color: '#2E8B57', // Verde escuro
  },
  {
    id: 'safra',
    name: 'Banco Safra',
    monthlyRate: 1.50,
    color: '#DC143C', // Vermelho carmesim
  },
  {
    id: 'daycoval',
    name: 'Banco Daycoval',
    monthlyRate: 1.65,
    color: '#4169E1', // Azul royal
  },
  {
    id: 'omni',
    name: 'Banco Omni',
    monthlyRate: 1.60,
    color: '#FF1493', // Rosa profundo
  },
  {
    id: 'carbank',
    name: 'Banco Carbank',
    monthlyRate: 1.68,
    color: '#FFB6C1', // Rosa claro
  },
];

/**
 * Calcula o valor da parcela mensal usando a fórmula de juros compostos
 * Fórmula: P = (PV * i * (1 + i)^n) / ((1 + i)^n - 1)
 * Onde:
 * - P = Parcela mensal
 * - PV = Valor presente (principal)
 * - i = Taxa de juros mensal (em decimal)
 * - n = Número de períodos (meses)
 */
function calculateMonthlyPayment(principal: number, monthlyRate: number, months: number): number {
  const rate = monthlyRate / 100;
  if (rate === 0) {
    return principal / months;
  }
  const numerator = principal * rate * Math.pow(1 + rate, months);
  const denominator = Math.pow(1 + rate, months) - 1;
  return numerator / denominator;
}

/**
 * Calcula o total de juros pagos durante todo o financiamento
 */
function calculateTotalInterest(principal: number, monthlyPayment: number, months: number): number {
  return monthlyPayment * months - principal;
}

/**
 * Simula o financiamento para um banco específico
 */
export function simulateBank(bank: Bank, input: SimulationInput): BankResult {
  const monthlyPayment = calculateMonthlyPayment(input.amount, bank.monthlyRate, input.months);
  const totalAmount = monthlyPayment * input.months;
  const totalInterest = calculateTotalInterest(input.amount, monthlyPayment, input.months);

  return {
    bankId: bank.id,
    bankName: bank.name,
    monthlyRate: bank.monthlyRate,
    monthlyPayment,
    totalAmount,
    totalInterest,
  };
}

/**
 * Simula o financiamento para todos os bancos
 */
export function simulateAllBanks(input: SimulationInput): BankResult[] {
  return BANKS.map((bank) => simulateBank(bank, input)).sort((a, b) => a.monthlyRate - b.monthlyRate);
}

/**
 * Encontra o banco com a melhor taxa
 */
export function findBestBank(results: BankResult[]): BankResult | null {
  if (results.length === 0) return null;
  return results.reduce((best, current) => 
    current.monthlyRate < best.monthlyRate ? current : best
  );
}

/**
 * Gera a tabela de amortização para um banco
 */
export function generateAmortizationSchedule(
  principal: number,
  monthlyRate: number,
  monthlyPayment: number,
  months: number
): AmortizationEntry[] {
  const schedule: AmortizationEntry[] = [];
  let balance = principal;
  const rate = monthlyRate / 100;

  for (let month = 1; month <= months; month++) {
    const interest = balance * rate;
    const principalPayment = monthlyPayment - interest;
    balance -= principalPayment;

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest,
      balance: Math.max(0, balance), // Evita números negativos por arredondamento
    });
  }

  return schedule;
}

/**
 * Formata um valor numérico como moeda brasileira
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata uma taxa percentual
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Obtém um banco pelo ID
 */
export function getBankById(bankId: string): Bank | undefined {
  return BANKS.find((bank) => bank.id === bankId);
}
