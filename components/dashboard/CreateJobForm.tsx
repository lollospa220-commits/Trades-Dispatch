'use client';

import { createJob, type CreateJobResult } from '@/app/actions/jobs';
import { VOICE } from '@/lib/brand';
import { useActionState, useEffect, useState } from 'react';

type CustomerOption = { id: string; name: string };
type TechnicianOption = { id: string; name: string };

const initial: CreateJobResult | null = null;

export default function CreateJobForm({
  customers,
  technicians,
  isSolo = false,
}: {
  customers: CustomerOption[];
  technicians: TechnicianOption[];
  isSolo?: boolean;
}) {
  const [state, formAction, pending] = useActionState(createJob, initial);
  const [newCustomer, setNewCustomer] = useState(false);
  const [open, setOpen] = useState(false);

  // FAB ed empty state puntano a #nuovo-intervento: il pannello si apre da solo.
  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === '#nuovo-intervento') setOpen(true);
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  const toggle = () => {
    setOpen((v) => {
      if (v && window.location.hash === '#nuovo-intervento') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      return !v;
    });
  };

  const now = new Date();
  const defaultDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

  return (
    <section id="nuovo-intervento" className="brand-card mb-6 scroll-mt-24 p-4 sm:mb-8 sm:p-5">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="font-display block text-base font-semibold text-brand-navy">
            ＋ Nuovo intervento
          </span>
          <span className="mt-0.5 block text-sm text-brand-muted">
            {isSolo
              ? 'Programma un intervento: verrà assegnato automaticamente a te.'
              : 'Programma un intervento e assegnalo a un tecnico (opzionale).'}
          </span>
        </span>
        <span
          aria-hidden
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-sand text-brand-navy transition-transform ${open ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>

      <form
        action={formAction}
        className={`mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 ${open ? '' : 'hidden'}`}
      >
        <label className="block sm:col-span-2">
          <span className="brand-label">
            Titolo intervento *
          </span>
          <input
            name="title"
            required
            maxLength={120}
            placeholder="es. Perdita sotto lavandino"
            className="brand-input mt-1.5"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="brand-label">
            Descrizione
          </span>
          <textarea
            name="description"
            rows={2}
            maxLength={500}
            placeholder="Note per il tecnico (opzionale)"
            className="brand-input mt-1.5"
          />
        </label>

        <label className="block">
          <span className="brand-label">
            Data *
          </span>
          <input
            name="date"
            type="date"
            required
            defaultValue={defaultDate}
            className="brand-input mt-1.5"
          />
        </label>

        <label className="block">
          <span className="brand-label">
            Ora *
          </span>
          <input
            name="time"
            type="time"
            required
            defaultValue="09:00"
            className="brand-input mt-1.5"
          />
        </label>

        {!isSolo && (
          <label className="block">
            <span className="brand-label">Tecnico (opzionale)</span>
            <select name="technicianId" defaultValue="" className="brand-input mt-1.5">
              <option value="">— Da assegnare —</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        )}
        {isSolo && technicians[0] && (
          <input type="hidden" name="technicianId" value={technicians[0].id} />
        )}

        <div className="block sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="brand-label">
              Cliente *
            </span>
            <button
              type="button"
              onClick={() => setNewCustomer((v) => !v)}
              className="text-xs font-semibold text-brand-blue hover:text-brand-blue-dark"
            >
              {newCustomer ? 'Cliente esistente' : '+ Nuovo cliente'}
            </button>
          </div>

          {!newCustomer ? (
            <select
              name="customerId"
              required={!newCustomer}
              defaultValue=""
              className="brand-input mt-1.5"
            >
              <option value="" disabled>
                Seleziona cliente
              </option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="mt-1.5 space-y-2 rounded-lg border border-dashed border-brand-sand-dark p-3">
              <input type="hidden" name="newCustomer" value="1" />
              <input
                name="customerName"
                required
                placeholder="Nome cliente *"
                className="brand-input"
              />
              <input
                name="customerPhone"
                placeholder="Telefono (per SMS)"
                className="brand-input"
              />
              <input
                name="customerAddress"
                placeholder="Indirizzo intervento"
                className="brand-input"
              />
            </div>
          )}
        </div>

        {state && !state.ok && (
          <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">
            {state.error}
          </p>
        )}
        {state?.ok && (
          <p className="sm:col-span-2 rounded-lg bg-brand-teal-light px-3 py-2 text-sm text-brand-teal ring-1 ring-brand-teal/20">
            Intervento creato con successo.
          </p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="brand-btn-dark"
          >
            {pending ? 'Salvataggio…' : VOICE.examples.ctaPrimary}
          </button>
        </div>
      </form>
    </section>
  );
}