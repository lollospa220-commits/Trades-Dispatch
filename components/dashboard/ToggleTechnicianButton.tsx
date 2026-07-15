'use client';

import { toggleTechnicianActive } from '@/app/actions/technicians';
import { useTransition } from 'react';

export default function ToggleTechnicianButton({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await toggleTechnicianActive(id, !active);
        })
      }
      className="rounded-lg border border-brand-sand-dark px-3 py-2 text-xs font-semibold"
    >
      {active ? 'Disattiva' : 'Riattiva'}
    </button>
  );
}