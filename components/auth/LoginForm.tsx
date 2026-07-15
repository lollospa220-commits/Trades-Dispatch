'use client';

import { loginAction, type AuthResult } from '@/app/actions/auth';
import { VOICE } from '@/lib/brand';
import { useActionState } from 'react';

const initial: AuthResult | null = null;

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form action={formAction} className="brand-card p-6">
      <label className="block">
        <span className="brand-label">Email azienda</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="brand-input mt-1.5"
          placeholder="admin@tuaazienda.it"
        />
      </label>

      <label className="mt-4 block">
        <span className="brand-label">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="brand-input mt-1.5"
          placeholder="••••••••"
        />
      </label>

      {state && !state.ok && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="brand-btn-primary mt-6 w-full">
        {pending ? 'Accesso…' : VOICE.examples.ctaLogin}
      </button>
    </form>
  );
}