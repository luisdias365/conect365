import { describe, it, expect } from 'vitest';
import {
  simulateBank,
  simulateAllBanks,
  findBestBank,
  generateAmortizationSchedule,
  formatCurrency,
  formatPercentage,
  BANKS,
} from './banks';
import { SimulationInput } from './types';

describe('Banks - Simulação de Financiamento', () => {
  const testInput: SimulationInput = {
    amount: 50000, // R$ 50.000
    months: 24, // 24 meses
  };

  describe('simulateBank', () => {
    it('deve calcular corretamente a simulação de um banco', () => {
      const bank = BANKS[0];
      const result = simulateBank(bank, testInput);

      expect(result.bankId).toBe(bank.id);
      expect(result.bankName).toBe(bank.name);
      expect(result.monthlyRate).toBe(bank.monthlyRate);
      expect(result.monthlyPayment).toBeGreaterThan(0);
      expect(result.totalAmount).toBeGreaterThan(testInput.amount);
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it('deve ter totalAmount igual a monthlyPayment * months', () => {
      const bank = BANKS[0];
      const result = simulateBank(bank, testInput);

      const calculated = result.monthlyPayment * testInput.months;
      expect(Math.abs(result.totalAmount - calculated)).toBeLessThan(1); // Tolerância de 1 centavo
    });

    it('deve ter totalInterest igual a totalAmount - amount', () => {
      const bank = BANKS[0];
      const result = simulateBank(bank, testInput);

      const expectedInterest = result.totalAmount - testInput.amount;
      expect(Math.abs(result.totalInterest - expectedInterest)).toBeLessThan(1);
    });

    it('deve retornar parcela maior com taxa maior', () => {
      const bank1 = BANKS[0];
      const bank2 = BANKS[1];

      const result1 = simulateBank(bank1, testInput);
      const result2 = simulateBank(bank2, testInput);

      if (bank1.monthlyRate > bank2.monthlyRate) {
        expect(result1.monthlyPayment).toBeGreaterThan(result2.monthlyPayment);
      } else {
        expect(result2.monthlyPayment).toBeGreaterThan(result1.monthlyPayment);
      }
    });
  });

  describe('simulateAllBanks', () => {
    it('deve retornar resultados para todos os bancos', () => {
      const results = simulateAllBanks(testInput);
      expect(results.length).toBe(BANKS.length);
    });

    it('deve ordenar resultados por taxa crescente', () => {
      const results = simulateAllBanks(testInput);

      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].monthlyRate).toBeLessThanOrEqual(results[i + 1].monthlyRate);
      }
    });

    it('deve conter todos os bancos nos resultados', () => {
      const results = simulateAllBanks(testInput);
      const resultIds = results.map((r) => r.bankId);
      const bankIds = BANKS.map((b) => b.id);

      expect(resultIds.sort()).toEqual(bankIds.sort());
    });
  });

  describe('findBestBank', () => {
    it('deve encontrar o banco com menor taxa', () => {
      const results = simulateAllBanks(testInput);
      const best = findBestBank(results);

      expect(best).not.toBeNull();
      expect(best?.monthlyRate).toBe(Math.min(...results.map((r) => r.monthlyRate)));
    });

    it('deve retornar null para lista vazia', () => {
      const best = findBestBank([]);
      expect(best).toBeNull();
    });

    it('deve retornar o primeiro elemento para lista com um item', () => {
      const results = simulateAllBanks(testInput);
      const single = [results[0]];
      const best = findBestBank(single);

      expect(best).toEqual(single[0]);
    });
  });

  describe('generateAmortizationSchedule', () => {
    it('deve gerar tabela com número correto de parcelas', () => {
      const schedule = generateAmortizationSchedule(
        testInput.amount,
        1.5,
        2000,
        testInput.months
      );

      expect(schedule.length).toBe(testInput.months);
    });

    it('deve ter primeiro mês com juros calculados', () => {
      const schedule = generateAmortizationSchedule(
        testInput.amount,
        1.5,
        2000,
        testInput.months
      );

      const firstEntry = schedule[0];
      const expectedInterest = testInput.amount * (1.5 / 100);

      expect(Math.abs(firstEntry.interest - expectedInterest)).toBeLessThan(1);
    });

    it('deve ter saldo reduzindo a cada parcela', () => {
      const schedule = generateAmortizationSchedule(
        testInput.amount,
        1.5,
        2000,
        testInput.months
      );

      for (let i = 0; i < schedule.length - 1; i++) {
        expect(schedule[i].balance).toBeGreaterThanOrEqual(schedule[i + 1].balance);
      }
    });

    it('deve ter saldo final próximo a zero', () => {
      // Usar valores que resultam em uma parcela que liquida completamente
      const schedule = generateAmortizationSchedule(
        50000,
        1.5,
        2500, // Parcela maior para liquidar mais rápido
        24
      );

      const lastEntry = schedule[schedule.length - 1];
      expect(lastEntry.balance).toBeLessThan(100); // Saldo residual pequeno
    });

    it('deve ter payment igual a principal + interest', () => {
      const schedule = generateAmortizationSchedule(
        testInput.amount,
        1.5,
        2000,
        testInput.months
      );

      for (const entry of schedule) {
        const sum = entry.principal + entry.interest;
        expect(Math.abs(entry.payment - sum)).toBeLessThan(0.01);
      }
    });
  });

  describe('formatCurrency', () => {
    it('deve formatar valor como moeda brasileira', () => {
      const formatted = formatCurrency(1000);
      expect(formatted).toContain('R$');
      expect(formatted).toContain('1');
      expect(formatted).toContain('000');
    });

    it('deve formatar valores pequenos corretamente', () => {
      const formatted = formatCurrency(50.5);
      expect(formatted).toContain('50');
    });

    it('deve formatar valores grandes corretamente', () => {
      const formatted = formatCurrency(1000000);
      expect(formatted).toContain('1');
    });
  });

  describe('formatPercentage', () => {
    it('deve formatar porcentagem com símbolo %', () => {
      const formatted = formatPercentage(1.5);
      expect(formatted).toBe('1.50%');
    });

    it('deve respeitar número de casas decimais', () => {
      const formatted = formatPercentage(1.567, 1);
      expect(formatted).toBe('1.6%');
    });

    it('deve formatar zero corretamente', () => {
      const formatted = formatPercentage(0);
      expect(formatted).toBe('0.00%');
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com financiamento mínimo', () => {
      const minInput: SimulationInput = {
        amount: 1000,
        months: 1,
      };

      const results = simulateAllBanks(minInput);
      expect(results.length).toBe(BANKS.length);
      expect(results.every((r) => r.monthlyPayment > 0)).toBe(true);
    });

    it('deve lidar com financiamento máximo', () => {
      const maxInput: SimulationInput = {
        amount: 1000000,
        months: 360,
      };

      const results = simulateAllBanks(maxInput);
      expect(results.length).toBe(BANKS.length);
      expect(results.every((r) => r.monthlyPayment > 0)).toBe(true);
    });

    it('deve lidar com prazo longo', () => {
      const longTermInput: SimulationInput = {
        amount: 100000,
        months: 360,
      };

      const results = simulateAllBanks(longTermInput);
      const best = findBestBank(results);

      expect(best).not.toBeNull();
      expect(best!.totalAmount).toBeGreaterThan(longTermInput.amount);
    });
  });
});
