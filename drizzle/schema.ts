import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here
export const simulacoes = mysqlTable("simulacoes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  valorVeiculo: int("valorVeiculo").notNull(),
  anoVeiculo: int("anoVeiculo").notNull(),
  marcaVeiculo: varchar("marcaVeiculo", { length: 100 }).notNull(),
  modeloVeiculo: varchar("modeloVeiculo", { length: 100 }).notNull(),
  banco: varchar("banco", { length: 100 }).notNull(),
  valorEntrada: int("valorEntrada").notNull(),
  numeroParcelas: int("numeroParcelas").notNull(),
  taxaJurosMensal: int("taxaJurosMensal").notNull(),
  valorParcela: int("valorParcela").notNull(),
  valorTotalFinanciado: int("valorTotalFinanciado").notNull(),
  valorTotalPago: int("valorTotalPago").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Simulacao = typeof simulacoes.$inferSelect;
export type InsertSimulacao = typeof simulacoes.$inferInsert;
export const bancos = mysqlTable("bancos", {
  id: varchar("id", { length: 50 }).primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  taxaMensal: int("taxaMensal").notNull(),
  cor: varchar("cor", { length: 7 }).notNull().default('#000000'),
  ativo: int("ativo").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Banco = typeof bancos.$inferSelect;
export type InsertBanco = typeof bancos.$inferInsert;