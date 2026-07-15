'use client';

import { forgotPasswordAction, type AuthResult } from '@/app/actions/auth';
import { useActionState } from 'react';

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, null as AuthResult | null);

  return (
    <form action={formAction} className="brand-card p-4 sm:p-6">
      <label className="block">
        <span className="brand-label">Email account</span>
        <input name="email" type="email" required className="brand-input mt-1.5" />
      </label>
      {state?.ok && (
        <p className="mt-4 text-sm text-brand-teal">
          Se l&apos;email esiste, riceverai un link per reimpostare la password.
        </p>
      )}
      {state && !state.ok && (
        <p className="mt-4 text-sm text-red-700">{state.error}</p>
      )}
      <button type="submit" disabled={pending} className="brand-btn-primary mt-6 w-full">
        {pending ? 'Invio…' : 'Invia link'}
      </button>
    </form>
  );
}