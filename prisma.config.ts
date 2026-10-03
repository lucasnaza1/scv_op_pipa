import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // process.env direto (com fallback) em vez de env() para que comandos que
  // não precisam de banco (ex.: prisma generate) funcionem sem DATABASE_URL.
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
