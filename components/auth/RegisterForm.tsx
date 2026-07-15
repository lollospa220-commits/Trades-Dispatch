'use client';

import { registerAction, type AuthResult } from '@/app/actions/auth';
import { useActionState, useState } from 'react';

const initial: AuthResult | null = null;

type AccountChoice = 'COMPANY' | 'SOLO' | null;

const ACCOUNT_OPTIONS = [
  {
    value: 'SOLO' as const,
    title: 'Operatore singolo',
    description: 'Lavori da solo: gestisci i tuoi interventi senza assegnare tecnici.',
  },
  {
    value: 'COMPANY' as const,
    title: 'Azienda con operatori',
    description: 'Hai un team: programmi interventi e assegni i tecnici dal pannello.',
  },
];

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initial);
  const [accountType, setAccountType] = useState<AccountChoice>(null);

  return (
    <form action={formAction} className="brand-card p-6">
      <fieldset>
        <legend className="brand-label">Come lavori?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {ACCOUNT_OPTIONS.map((opt) => {
            const selected = accountType === opt.value;
            return (
              <label
                key={opt.value}
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  selected
                    ? 'border-brand-blue bg-brand-blue/5 ring-2 ring-brand-blue/25'
                    : 'border-brand-sand-dark hover:border-brand-blue/40'
                }`}
              >
                <input
                  type="radio"
                  name="accountType"
                  value={opt.value}
                  required
                  className="sr-only"
                  checked={selected}
                  onChange={() => setAccountType(opt.value)}
                />
                <span className="block font-display text-sm font-semibold text-brand-navy">
                  {opt.title}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-brand-muted">
                  {opt.description}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {accountType === 'SOLO' && (
        <div className="mt-6 space-y-4 border-t border-brand-sand-dark pt-6">
          <label className="block">
            <span className="brand-label">Nome e cognome *</span>
            <input
              name="operatorName"
              required
              autoComplete="name"
              className="brand-input mt-1.5"
              placeholder="Marco Bianchi"
            />
          </label>
          <label className="block">
            <span className="brand-label">Nome attività (opzionale)</span>
            <input
              name="businessName"
              className="brand-input mt-1.5"
              placeholder="Idraulica Bianchi"
            />
          </label>
          <label className="block">
            <span className="brand-label">Telefono (opzionale)</span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              className="brand-input mt-1.5"
              placeholder="+39 333 123 4567"
            />
          </label>
        </div>
      )}

      {accountType === 'COMPANY' && (
        <div className="mt-6 border-t border-brand-sand-dark pt-6">
          <label className="block">
            <span className="brand-label">Nome azienda *</span>
            <input
              name="companyName"
              required
              autoComplete="organization"
              className="brand-input mt-1.5"
              placeholder="Idraulica Rossi S.r.l."
            />
          </label>
        </div>
      )}

      {accountType && (
        <div className="mt-6 space-y-4 border-t border-brand-sand-dark pt-6">
          <label className="block">
            <span className="brand-label">Email *</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="brand-input mt-1.5"
              placeholder={accountType === 'SOLO' ? 'tu@email.it' : 'admin@tuaazienda.it'}
            />
          </label>

          <label className="block">
            <span className="brand-label">Password *</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="brand-input mt-1.5"
              placeholder="Minimo 8 caratteri"
            />
          </label>

          <label className="block">
            <span className="brand-label">Conferma password *</span>
            <input
              name="passwordConfirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="brand-input mt-1.5"
              placeholder="Ripeti la password"
            />
          </label>
        </div>
      )}

      {state && !state.ok && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !accountType}
        className="brand-btn-primary mt-6 w-full disabled:opacity-50"
      >
        {pending ? 'Registrazione…' : 'Crea account'}
      </button>
    </form>
  );
}