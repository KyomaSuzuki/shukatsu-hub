// Prismaクライアントのシングルトン
// 開発中にホットリロードで接続が増えすぎるのを防ぐパターン
// (MANUAL.md「6. Prisma」参照)

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
