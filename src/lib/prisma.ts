// Prismaクライアントのシングルトン
// 開発中にホットリロードで接続が増えすぎるのを防ぐパターン
// (MANUAL.md「6. Prisma」参照)
// Prisma 7: ドライバーアダプターが必須

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const pool = new pg.Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

