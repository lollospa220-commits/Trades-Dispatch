'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('td_cookies_ok')) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-sand-dark bg-white p-4 shadow-lg safe-bottom">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-brand-muted">
          Usiamo cookie tecnici per la sessione.{' '}
          <Link href="/privacy" className="text-brand-blue hover:underline">
            Privacy
          </Link>
        </p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem('td_cookies_ok', '1');
            setShow(false);
          }}
          className="brand-btn-primary shrink-0 px-4 py-2 text-xs"
        >
          OK
        </button>
      </div>
    </div>
  );
}