import Link from 'next/link';

const VIEWS = [
  { id: 'today', label: 'Oggi' },
  { id: 'week', label: 'Settimana' },
  { id: 'history', label: 'Storico' },
] as const;

export type AgendaView = (typeof VIEWS)[number]['id'];

export default function AgendaTabs({ view, q }: { view: AgendaView; q?: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {VIEWS.map((v) => {
        const params = new URLSearchParams();
        params.set('view', v.id);
        if (q) params.set('q', q);
        const active = view === v.id;
        return (
          <Link
            key={v.id}
            href={`/dashboard?${params.toString()}`}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              active
                ? 'bg-brand-navy text-white'
                : 'bg-white text-brand-muted ring-1 ring-brand-sand-dark hover:text-brand-navy'
            }`}
          >
            {v.label}
          </Link>
        );
      })}
    </div>
  );
}