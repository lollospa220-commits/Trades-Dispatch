export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-label="Caricamento agenda">
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="brand-card animate-pulse p-3 sm:p-4">
            <div className="h-7 w-12 rounded bg-brand-sand-dark/60" />
            <div className="mt-1.5 h-3 w-20 rounded bg-brand-sand-dark/40" />
          </div>
        ))}
      </div>
      <div className="brand-card mb-6 animate-pulse p-4 sm:mb-8 sm:p-5">
        <div className="h-5 w-40 rounded bg-brand-sand-dark/60" />
        <div className="mt-2 h-4 w-64 max-w-full rounded bg-brand-sand-dark/40" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="h-11 rounded-lg bg-brand-sand-dark/40 sm:col-span-2" />
          <div className="h-11 rounded-lg bg-brand-sand-dark/40" />
          <div className="h-11 rounded-lg bg-brand-sand-dark/40" />
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="h-9 w-24 animate-pulse rounded-lg bg-brand-sand-dark/50" />
        <div className="h-9 w-28 animate-pulse rounded-lg bg-brand-sand-dark/40" />
        <div className="h-9 w-24 animate-pulse rounded-lg bg-brand-sand-dark/40" />
      </div>

      <div className="brand-card animate-pulse p-0">
        <div className="divide-y divide-brand-sand-dark/60">
          {[0, 1, 2].map((i) => (
            <div key={i} className="p-4">
              <div className="h-4 w-16 rounded bg-brand-sand-dark/60" />
              <div className="mt-2 h-4 w-48 max-w-full rounded bg-brand-sand-dark/40" />
              <div className="mt-2 h-3 w-32 rounded bg-brand-sand-dark/30" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
