'use client';

import { logoutAction } from '@/app/actions/auth';

export default function LogoutButton({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const cls =
    theme === 'light'
      ? 'border-white/20 bg-white/10 text-white hover:bg-white/15'
      : 'border-brand-sand-dark bg-white text-brand-muted hover:bg-brand-sand';

  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition ${cls}`}
      >
        Esci
      </button>
    </form>
  );
}