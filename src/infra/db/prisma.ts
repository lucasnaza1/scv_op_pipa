// src/infra/db/prisma.ts
// Client gerado em node_modules (generator prisma-client-js sem output custom).
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    const raw = process.env.DATABASE_URL;
    if (!raw) throw new Error("DATABASE_URL não definida");

    const u = new URL(raw);
    const adapter = new PrismaMariaDb({
      host: u.hostname,
      port: Number(u.port || 3306),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.slice(1),
    });

    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}