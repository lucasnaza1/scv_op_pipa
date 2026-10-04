import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Prisma 7 exige driver adapter explícito. Para MySQL usamos o driver
// mariadb (compatível com MySQL 8 / Railway), que recebe um PoolConfig
// (host, porta, usuário, senha, banco) — e não uma connection string.
const criarPrisma = () => {
  const url = new URL(process.env.DATABASE_URL ?? "");

  return new PrismaClient({
    adapter: new PrismaMariaDb({
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace("/", ""),
      connectionLimit: 5,
    }),
  });
};

// Singleton de PrismaClient: em dev o Next.js recarrega o módulo a cada
// request e, sem isso, cada reload abriria uma nova conexão com o banco.
const globalComPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalComPrisma.prisma ?? criarPrisma();

if (process.env.NODE_ENV !== "production") {
  globalComPrisma.prisma = prisma;
}
