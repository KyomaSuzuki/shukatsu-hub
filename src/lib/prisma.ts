// Prismaクライアントのシングルトン
// 開発中にホットリロードで接続が増えすぎるのを防ぐパターン
// (MANUAL.md「6. Prisma」参照)
// Prisma 7: ドライバーアダプターが必須

import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
