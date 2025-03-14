import { PrismaClient } from '@prisma/client';

export let prisma: PrismaClient | null = null;

export async function initPrisma() {
  prisma = new PrismaClient();
  await prisma.$connect();
  return prisma;
}
