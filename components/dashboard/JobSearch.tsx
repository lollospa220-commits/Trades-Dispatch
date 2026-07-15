'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function JobSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');

  return (
    <form
      className="mb-4"
      onSubmit={(e) => {
        e.preventDefault();
        const next = new URLSearchParams(params.toString());
        if (q.trim()) next.set('q', q.trim());
        else next.delete('q');
        router.push(`/dashboard?${next.toString()}`);
      }}
    >
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cerca cliente o intervento…"
        className="brand-input"
        aria-label="Cerca interventi"
      />
    </form>
  );
}