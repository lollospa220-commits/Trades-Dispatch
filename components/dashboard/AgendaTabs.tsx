import Link from 'next/link';

const VIEWS = [
  { id: 'today', label: 'Oggi' },
  { id: 'week', label: 'Settimana' },
  { id: 'history', label: 'Storico' },
] as const;

export type AgendaView = (typeof VIEWS)[number]['id'];
export type AgendaCounts = Partial<Record<AgendaView, number>>;

export default function AgendaTabs({
  view,
  q,
  counts,
}: {
  view: AgendaView;
  q?: string;
  counts?: AgendaCounts;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {VIEWS.map((v) => {
        const params = new URLSearchParams();
        params.set('view', v.id);
        if (q) params.set('q', q);
        const active = view === v.id;
        const count = counts?.[v.id];
        return (
          <Link
            key={v.id}
            href={`/dashboard?${params.toString()}`}
            className={`flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition ${
              active
                ? 'bg-brand-navy text-white'
                : 'bg-white text-brand-muted ring-1 ring-brand-sand-dark hover:text-brand-navy'
            }`}
          >
            {v.label}
            {count !== undefined && (
              <span
                className={`rounded-full px-1.5 text-xs tabular-nums ${
                  active ? 'bg-white/20' : 'bg-brand-sand'
                }`}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
