'use client';

import { resetPasswordAction, type AuthResult } from '@/app/actions/auth';
import { useActionState } from 'react';
import Link from 'next/link';

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, null as AuthResult | null);

  if (state?.ok) {
    return (
      <div className="brand-card p-6 text-center">
        <p className="text-sm text-brand-teal">Password aggiornata.</p>
        <Link href="/login" className="brand-btn-primary mt-4 inline-flex">
          Vai al login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="brand-card p-4 sm:p-6">
      <input type="hidden" name="token" value={token} />
      <label className="block">
        <span className="brand-label">Nuova password</span>
        <input name="password" type="password" required minLength={8} className="brand-input mt-1.5" />
      </label>
      <label className="mt-4 block">
        <span className="brand-label">Conferma</span>
        <input name="passwordConfirm" type="password" required minLength={8} className="brand-input mt-1.5" />
      </label>
      {state && !state.ok && <p className="mt-4 text-sm text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className="brand-btn-primary mt-6 w-full">
        {pending ? 'Salvataggio…' : 'Reimposta password'}
      </button>
    </form>
  );
}