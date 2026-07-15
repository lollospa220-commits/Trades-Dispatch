import { getSession } from '@/lib/auth';

export async function sessionOrError(): Promise<
  | { ok: true; companyId: string; accountType: 'COMPANY' | 'SOLO' }
  | { ok: false; error: string }
> {
  const session = await getSession();
  if (!session) return { ok: false, error: 'Sessione scaduta. Effettua di nuovo il login.' };
  return {
    ok: true,
    companyId: session.companyId,
    accountType: session.accountType,
  };
}