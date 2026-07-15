export default function InvoicesLoading() {
  return (
    <div aria-busy="true" aria-label="Caricamento fatture">
      <div className="flex items-center justify-between">
        <div className="h-6 w-28 animate-pulse rounded bg-brand-sand-dark/60" />
        <div className="h-11 w-36 animate-pulse rounded-lg bg-brand-sand-dark/50" />
      </div>
      <div className="mt-4 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-11 w-24 animate-pulse rounded-lg bg-brand-sand-dark/40" />
        ))}
      </div>
      <div className="brand-card mt-4 animate-pulse p-0">
        <div className="divide-y divide-brand-sand-dark/60">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="p-4">
              <div className="h-4 w-24 rounded bg-brand-sand-dark/60" />
              <div className="mt-2 h-4 w-48 max-w-full rounded bg-brand-sand-dark/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
