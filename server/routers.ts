import { z } from "zod";
import { criarSimulacao, getSimulacoesByUserId, deletarSimulacao, getBancos, upsertBanco, inicializarBancos } from "./db";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
bancos: router({
  listar: publicProcedure.query(async () => {
    const lista = await getBancos();
    return lista.map(b => ({
      ...b,
      taxaMensal: b.taxaMensal / 100,
    }));
  }),

  salvar: publicProcedure
    .input(z.object({
      id: z.string(),
      nome: z.string(),
      taxa: z.number(),
      cor: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await upsertBanco({
        id: input.id,
        nome: input.nome,
        taxaMensal: Math.round(input.taxa * 100),
        cor: input.cor ?? '#000000',
        ativo: 1,
      });
      return { success: true };
    }),

  adicionarNovo: publicProcedure
    .input(z.object({
      nome: z.string(),
      taxa: z.number(),
      cor: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = input.nome.toLowerCase().replace(/\s/g, '_');
      await upsertBanco({
        id,
        nome: input.nome,
        taxaMensal: Math.round(input.taxa * 100),
        cor: input.cor ?? '#000000',
        ativo: 1,
      });
      return { success: true };
    }),
}),
financiamento: router({
  listarBancos: publicProcedure.query(() => {
    return [
      { nome: "BV Financeira",    taxaMensal: 1.14 },
{ nome: "Santander",        taxaMensal: 1.59 },
{ nome: "Banco Volkswagen", taxaMensal: 1.62 },
{ nome: "Bradesco",         taxaMensal: 1.65 },
{ nome: "Banco do Brasil",  taxaMensal: 1.82 },
{ nome: "Itaú",             taxaMensal: 1.74 },
{ nome: "Caixa Econômica",  taxaMensal: 1.80 },
{ nome: "Sicredi",          taxaMensal: 1.85 },
{ nome: "Pan",              taxaMensal: 2.20 },
{ nome: "Omni",             taxaMensal: 2.90 },
{ nome: "C6 Bank", taxaMensal: 1.38 },
{ nome: "Banco Safra", taxaMensal: 1.45 },
    ];
  }),

  simular: publicProcedure
    .input(z.object({
      valorVeiculo: z.number(),
      valorEntrada: z.number(),
      numeroParcelas: z.number(),
      banco: z.string(),
    }))
    .query(({ input }) => {
      const bancos: Record<string, number> = {
        "Banco do Brasil": 1.49, "Bradesco": 1.59, "Itaú": 1.69,
        "Santander": 1.79, "Caixa Econômica": 1.39, "BV Financeira": 1.89,
        "Sicredi": 1.44, "Banrisul": 1.54,
      };
      const taxa = (bancos[input.banco] ?? 1.99) / 100;
      const valorFinanciado = input.valorVeiculo - input.valorEntrada;
      const parcela = valorFinanciado * (taxa * Math.pow(1 + taxa, input.numeroParcelas)) / (Math.pow(1 + taxa, input.numeroParcelas) - 1);
      return {
        banco: input.banco,
        taxaMensal: bancos[input.banco],
        valorParcela: Math.round(parcela * 100) / 100,
        valorTotalFinanciado: valorFinanciado,
        valorTotalPago: Math.round(parcela * input.numeroParcelas * 100) / 100,
      };
    }),

  salvar: publicProcedure
    .input(z.object({
      valorVeiculo: z.number(), valorEntrada: z.number(),
      numeroParcelas: z.number(), banco: z.string(),
      anoVeiculo: z.number(), marcaVeiculo: z.string(), modeloVeiculo: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Não autenticado");
      const bancos: Record<string, number> = {
        "Banco do Brasil": 149, "Bradesco": 159, "Itaú": 169,
        "Santander": 179, "Caixa Econômica": 139, "BV Financeira": 189,
        "Sicredi": 144, "Banrisul": 154,
      };
      const taxaBasisPoints = bancos[input.banco] ?? 199;
      const taxa = taxaBasisPoints / 10000;
      const valorFinanciado = Math.round((input.valorVeiculo - input.valorEntrada) * 100);
      const parcela = Math.round(valorFinanciado * (taxa * Math.pow(1 + taxa, input.numeroParcelas)) / (Math.pow(1 + taxa, input.numeroParcelas) - 1));
      await criarSimulacao({
        userId: ctx.user.id,
        valorVeiculo: Math.round(input.valorVeiculo * 100),
        valorEntrada: Math.round(input.valorEntrada * 100),
        numeroParcelas: input.numeroParcelas,
        banco: input.banco,
        taxaJurosMensal: taxaBasisPoints,
        anoVeiculo: input.anoVeiculo,
        marcaVeiculo: input.marcaVeiculo,
        modeloVeiculo: input.modeloVeiculo,
        valorParcela: parcela,
        valorTotalFinanciado: valorFinanciado,
        valorTotalPago: parcela * input.numeroParcelas,
      });
      return { success: true };
    }),

  listar: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return [];
    const sims = await getSimulacoesByUserId(ctx.user.id);
    return sims.map(s => ({ ...s, valorVeiculo: s.valorVeiculo / 100, valorEntrada: s.valorEntrada / 100, valorParcela: s.valorParcela / 100, valorTotalPago: s.valorTotalPago / 100 }));
  }),

  deletar: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Não autenticado");
      await deletarSimulacao(input.id);
      return { success: true };
    }),
}),});

export type AppRouter = typeof appRouter;
