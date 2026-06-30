import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, simulacoes, InsertSimulacao, bancos, InsertBanco } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.
export async function criarSimulacao(dados: InsertSimulacao): Promise<void> {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot create simulacao"); return; }
  await db.insert(simulacoes).values(dados);
}

export async function getSimulacoesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(simulacoes).where(eq(simulacoes.userId, userId)).orderBy(simulacoes.createdAt);
}

export async function deletarSimulacao(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(simulacoes).where(eq(simulacoes.id, id));
}
export async function getBancos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(bancos).where(eq(bancos.ativo, 1)).orderBy(bancos.taxaMensal);
}

export async function upsertBanco(banco: InsertBanco): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(bancos).values(banco).onDuplicateKeyUpdate({
    set: { nome: banco.nome, taxaMensal: banco.taxaMensal, cor: banco.cor },
  });
}

export async function inicializarBancos(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(bancos).limit(1);
  if (existing.length > 0) return;

  const bancosIniciais: InsertBanco[] = [
    { id: 'bv', nome: 'BV Financeira', taxaMensal: 114, cor: '#FF6B00' },
    { id: 'santander', nome: 'Santander', taxaMensal: 129, cor: '#EC0000' },
    { id: 'volkswagen', nome: 'Banco Volkswagen', taxaMensal: 152, cor: '#001E50' },
    { id: 'bradesco', nome: 'Bradesco', taxaMensal: 155, cor: '#C41F3A' },
    { id: 'bb', nome: 'Banco do Brasil', taxaMensal: 162, cor: '#FFD700' },
    { id: 'itau', nome: 'Itaú', taxaMensal: 174, cor: '#EC7000' },
    { id: 'caixa', nome: 'Caixa Econômica', taxaMensal: 180, cor: '#0066CC' },
    { id: 'sicredi', nome: 'Sicredi', taxaMensal: 185, cor: '#009A44' },
    { id: 'pan', nome: 'Banco Pan', taxaMensal: 210, cor: '#FF6B35' },
    { id: 'omni', nome: 'Omni', taxaMensal: 290, cor: '#8B0000' },
    { id: 'c6', nome: 'C6 Bank', taxaMensal: 138, cor: '#000000' },
    { id: 'safra', nome: 'Banco Safra', taxaMensal: 145, cor: '#1B3A6B' },
  ];

  for (const banco of bancosIniciais) {
    await db.insert(bancos).values(banco).onDuplicateKeyUpdate({ set: { nome: banco.nome } });
  }
}