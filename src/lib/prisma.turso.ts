/**
 * Turso (libsql) Prisma client — used in production/Vercel deployments.
 * This file is imported only when TURSO_DATABASE_URL is set.
 * The import of @prisma/adapter-libsql is isolated here to prevent webpack
 * from trying to bundle @libsql/client during local development.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prismaTurso: PrismaClient | undefined;
};

const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const prismaTurso =
  globalForPrisma.prismaTurso ??
  new PrismaClient({
    adapter,
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaTurso = prismaTurso;
