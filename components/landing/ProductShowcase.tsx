import { LANDING } from '@/lib/landing';
import Link from 'next/link';

/** Anteprima fedele alla dashboard reale — stessi colori, stessi pattern UI. */
export default function ProductShowcase() {
  const { product } = LANDING;

  return (
    <section id="prodotto" className="landing-section scroll-mt-20 border-y border-brand-sand-dark bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-brand-navy sm:text-3xl">{product.title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-brand-muted">{product.subtitle}</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Vista 1 — Agenda */}
          <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-brand-sand-dark lg:col-span-2">
            <div className="bg-brand-navy px-4 py-3 text-white">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-sm font-semibold">Idraulica Rossi</span>
                <span className="text-xs text-white/60">3 interventi oggi</span>
              </div>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="rounded-md bg-brand-amber px-2 py-1 font-semibold text-brand-navy">Oggi</span>
                <span className="rounded-md px-2 py-1 text-white/50">Settimana</span>
                <span className="rounded-md px-2 py-1 text-white/50">Storico</span>
              </div>
            </div>
            <div className="space-y-2 bg-brand-sand p-4">
              {[
                { time: '09:00', client: 'Rossi Mario', job: 'Perdita lavandino', status: 'Programmato', color: 'bg-brand-sand text-brand-ink' },
                { time: '11:30', client: 'Bianchi Laura', job: 'Caldaia — manutenzione', status: 'In corso', color: 'bg-brand-amber-light text-brand-amber' },
                { time: '15:00', client: 'Verdi Spa', job: 'Sostituzione gruppo', status: 'Completato', color: 'bg-brand-teal-light text-brand-teal' },
              ].map((row) => (
                <div key={row.time} className="rounded-xl border border-brand-sand-dark bg-white p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-lg font-bold text-brand-navy">{row.time}</p>
                      <p className="text-sm font-medium">{row.client}</p>
                      <p className="text-xs text-brand-muted">{row.job}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${row.color}`}>
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vista 2 — Nuovo intervento */}
          <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-brand-sand-dark">
            <div className="border-b border-brand-sand-dark bg-white px-4 py-3">
              <p className="font-display text-sm font-semibold text-brand-navy">Nuovo intervento</p>
            </div>
            <div className="space-y-3 bg-white p-4">
              <div className="h-9 rounded-lg border border-brand-sand-dark bg-brand-sand/50 px-3 py-2 text-xs text-brand-muted">
                Perdita sotto lavandino
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-9 rounded-lg border border-brand-sand-dark bg-brand-sand/50 px-2 py-2 text-xs text-brand-muted">15/07/2026</div>
                <div className="h-9 rounded-lg border border-brand-sand-dark bg-brand-sand/50 px-2 py-2 text-xs text-brand-muted">09:00</div>
              </div>
              <div className="h-9 rounded-lg border border-brand-sand-dark bg-brand-sand/50 px-3 py-2 text-xs text-brand-muted">
                Cliente: Rossi Mario
              </div>
              <div className="h-9 rounded-lg bg-brand-navy text-center text-xs font-semibold leading-9 text-white">
                Crea intervento
              </div>
            </div>
          </div>

          {/* Vista 3 — Rapportino */}
          <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-brand-sand-dark lg:col-span-3">
            <div className="grid md:grid-cols-2">
              <div className="border-b border-brand-sand-dark p-4 md:border-b-0 md:border-r">
                <p className="font-display text-sm font-semibold text-brand-navy">Rapportino intervento</p>
                <p className="mt-1 text-xs text-brand-muted">Caldaia — manutenzione · Bianchi Laura</p>
                <div className="mt-4 space-y-2 text-xs text-brand-ink">
                  <p>✓ Lavoro eseguito: pulizia scambiatore, test pressione OK</p>
                  <p>✓ Firma cliente acquisita</p>
                  <p>✓ 2 foto allegate</p>
                </div>
                <div className="mt-4 h-16 rounded-lg border border-dashed border-brand-sand-dark bg-brand-sand/40">
                  <svg viewBox="0 0 200 50" className="h-full w-full text-brand-muted/50" aria-hidden>
                    <path d="M20 35 Q60 10 100 30 T180 25" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <p className="mt-1 text-[10px] text-brand-muted">Firma cliente</p>
              </div>
              <div className="flex flex-col justify-center bg-brand-sand/50 p-4">
                <p className="text-sm font-semibold text-brand-navy">PDF pronto da inviare</p>
                <p className="mt-1 text-xs text-brand-muted">
                  Meno contestazioni, più professionalità. Archivio sullo storico interventi.
                </p>
                <Link href="/register" className="brand-btn-primary mt-4 w-full text-center text-xs sm:w-auto">
                  Provalo gratis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}