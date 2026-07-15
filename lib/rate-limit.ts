import { prisma } from '@/lib/prisma';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;

/** Blocca brute force login — funziona su serverless perché persiste su DB. */
export async function isLoginBlocked(email: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);
  const failures = await prisma.loginAttempt.count({
    where: { email, success: false, createdAt: { gte: since } },
  });
  return failures >= MAX_FAILURES;
}

export async function recordLoginAttempt(email: string, success: boolean, ip?: string): Promise<void> {
  await prisma.loginAttempt.create({
    data: { email, success, ip: ip ?? null },
  });
}