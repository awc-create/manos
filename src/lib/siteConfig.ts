// src/lib/siteConfig.ts
import { prisma } from '@/lib/prisma';

export async function getSiteConfig<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await prisma.siteConfig.findUnique({ where: { key } });
    if (!row) return fallback;
    return row.value as T;
  } catch {
    return fallback;
  }
}

export async function setSiteConfig<T>(key: string, value: T): Promise<void> {
  await prisma.siteConfig.upsert({
    where: { key },
    update: { value: value as object },
    create: { key, value: value as object },
  });
}
