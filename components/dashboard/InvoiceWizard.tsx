'use client';

import { saveInvoice, type InvoiceActionResult } from '@/app/actions/invoices';
import {
  computeTotals,
  formatEuro,
  lineTotalCents,
  parseEuroToCents,
  parseQuantity,
  VAT_RATES,
  type ComputedLine,
  type WizardLine,
} from '@/lib/invoices';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useMemo, useState } from 'react';

export type WizardCustomer = {
  id: string;
  name: string;
  address: string | null;
  vatNumber: string | null;
  taxCode: string | null;
  sdiCode: string | null;
  pec: string | null;
};

export type WizardInitial = {
  invoiceId?: string;
  jobId?: string;
  customerId?: string;
  customerLocked?: boolean;
  issueDate: string; // YYYY-MM-DD
  notes?: string;
  lines: WizardLine[];
};

const STEPS = ['Cliente', 'Voci', 'Riepilogo'] as const;

const EMPTY_LINE: WizardLine = { description: '', quantity: '1', unitPriceEuro: '', vatRate: 22 };

function toComputed(lines: WizardLine[]): ComputedLine[] {
  const out: ComputedLine[] = [];
  for (const l of lines) {
    const quantity = parseQuantity(l.quantity);
    const unitPriceCents = parseEuroToCents(l.unitPriceEuro);
    if (!l.description.trim() || quantity === null || unitPriceCents === null) continue;
    out.push({
      description: l.description.trim(),
      quantity,
      unitPriceCents,
      vatRate: l.vatRate,
      totalCents: lineTotalCents(quantity, unitPriceCents),
    });
  }
  return out;
}

export default function InvoiceWizard({
  customers,
  initial,
}: {
  customers: WizardCustomer[];
  initial: WizardInitial;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<InvoiceActionResult | null, FormData>(
    saveInvoice,
    null,
  );

  const [step, setStep] = useState(0);
  const [customerId, setCustomerId] = useState(initial.customerId ?? '');
  const [lines, setLines] = useState<WizardLine[]>(
    initial.lines.length > 0 ? initial.lines : [EMPTY_LINE],
  );
  const [issueDate, setIssueDate] = useState(initial.issueDate);
  const [notes, setNotes] = useState(initial.notes ?? '');
  const [stepError, setStepError] = useState<string | null>(null);

  const customer = customers.find((c) => c.id === customerId) ?? null;
  const validLines = useMemo(() => toComputed(lines), [lines]);
  const totals = useMemo(() => computeTotals(validLines), [validLines]);

  useEffect(() => {
    if (state?.ok) router.push(`/dashboard/invoices/${state.id}`);
  }, [state, router]);

  const next = () => {
    if (step === 0 && !customerId) {
      setStepError('Seleziona un cliente per continuare.');
      return;
    }
    if (step === 1 && validLines.length === 0) {
      setStepError('Compila almeno una voce con descrizione, quantità e prezzo.');
      return;
    }
    setStepError(null);
    setStep((s) => Math.min(s + 1, 2));
  };

  const updateLine = (i: number, patch: Partial<WizardLine>) => {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Stepper */}
      <ol className="mb-6 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-2 text-sm font-semibold transition ${
                i === step
                  ? 'bg-brand-navy text-white'
                  : i < step
                    ? 'bg-brand-teal-light text-brand-teal'
                    : 'bg-white text-brand-muted ring-1 ring-brand-sand-dark'
              }`}
            >
              <span className="hidden sm:inline">{i + 1}.</span> {label}
            </button>
          </li>
        ))}
      </ol>

      <form action={formAction} className="brand-card p-4 sm:p-6">
        {initial.invoiceId && <input type="hidden" name="invoiceId" value={initial.invoiceId} />}
        {initial.jobId && <input type="hidden" name="jobId" value={initial.jobId} />}
        <input type="hidden" name="customerId" value={customerId} />
        <input type="hidden" name="issueDate" value={issueDate} />
        <input type="hidden" name="notes" value={notes} />
        <input type="hidden" name="lines" value={JSON.stringify(lines)} />

        {/* Step 1 — Cliente */}
        {step === 0 && (
          <div>
            <h2 className="font-display text-base font-semibold text-brand-navy">
              A chi intesti la fattura?
            </h2>
            <label className="mt-4 block">
              <span className="brand-label">Cliente *</span>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                disabled={initial.customerLocked}
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
            </label>
            {initial.customerLocked && (
              <p className="mt-1.5 text-xs text-brand-muted">
                Cliente dell&apos;intervento — non modificabile.
              </p>
            )}

            {customer && (
              <fieldset className="mt-5 rounded-lg border border-dashed border-brand-sand-dark p-3">
                <legend className="brand-label px-1">Dati fiscali (facoltativi)</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="brand-label">P.IVA</span>
                    <input
                      name="customerVatNumber"
                      defaultValue={customer.vatNumber ?? ''}
                      placeholder="IT01234567890"
                      className="brand-input mt-1.5"
                    />
                  </label>
                  <label className="block">
                    <span className="brand-label">Codice fiscale</span>
                    <input
                      name="customerTaxCode"
                      defaultValue={customer.taxCode ?? ''}
                      className="brand-input mt-1.5"
                    />
                  </label>
                  <label className="block">
                    <span className="brand-label">Codice SDI</span>
                    <input
                      name="customerSdiCode"
                      defaultValue={customer.sdiCode ?? ''}
                      placeholder="0000000"
                      className="brand-input mt-1.5"
                    />
                  </label>
                  <label className="block">
                    <span className="brand-label">PEC</span>
                    <input
                      name="customerPec"
                      type="email"
                      defaultValue={customer.pec ?? ''}
                      className="brand-input mt-1.5"
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-brand-muted">
                  Vengono salvati sulla scheda cliente per le prossime fatture.
                </p>
              </fieldset>
            )}
          </div>
        )}

        {/* Step 2 — Voci */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-base font-semibold text-brand-navy">
              Cosa metti in fattura?
            </h2>

            <ul className="mt-4 space-y-3">
              {lines.map((line, i) => {
                const qty = parseQuantity(line.quantity);
                const price = parseEuroToCents(line.unitPriceEuro);
                const rowTotal =
                  qty !== null && price !== null ? lineTotalCents(qty, price) : null;
                return (
                  <li key={i} className="rounded-lg border border-brand-sand-dark p-3">
                    <div className="flex items-start gap-2">
                      <input
                        value={line.description}
                        onChange={(e) => updateLine(i, { description: e.target.value })}
                        placeholder={`es. Manodopera intervento`}
                        maxLength={200}
                        className="brand-input flex-1"
                      />
                      {lines.length > 1 && (
                        <button
                          type="button"
                          aria-label={`Rimuovi voce ${i + 1}`}
                          onClick={() => setLines((prev) => prev.filter((_, idx) => idx !== i))}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <label className="block">
                        <span className="brand-label">Qtà</span>
                        <input
                          inputMode="decimal"
                          value={line.quantity}
                          onChange={(e) => updateLine(i, { quantity: e.target.value })}
                          className="brand-input mt-1"
                        />
                      </label>
                      <label className="block">
                        <span className="brand-label">Prezzo €</span>
                        <input
                          inputMode="decimal"
                          value={line.unitPriceEuro}
                          onChange={(e) => updateLine(i, { unitPriceEuro: e.target.value })}
                          placeholder="0,00"
                          className="brand-input mt-1"
                        />
                      </label>
                      <label className="block">
                        <span className="brand-label">IVA</span>
                        <select
                          value={line.vatRate}
                          onChange={(e) =>
                            updateLine(i, { vatRate: Number(e.target.value) as WizardLine['vatRate'] })
                          }
                          className="brand-input mt-1"
                        >
                          {VAT_RATES.map((r) => (
                            <option key={r} value={r}>
                              {r}%
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <p className="mt-2 text-right text-sm font-semibold text-brand-navy">
                      {rowTotal !== null ? formatEuro(rowTotal) : '—'}
                    </p>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={() => setLines((prev) => [...prev, EMPTY_LINE])}
              className="mt-3 flex min-h-11 w-full items-center justify-center rounded-lg border border-dashed border-brand-blue/40 text-sm font-semibold text-brand-blue"
            >
              + Aggiungi voce
            </button>

            <div className="mt-4 rounded-lg bg-brand-sand p-3 text-right text-sm">
              <p className="text-brand-muted">
                Imponibile <span className="font-semibold text-brand-ink">{formatEuro(totals.subtotalCents)}</span>
                {' · '}IVA <span className="font-semibold text-brand-ink">{formatEuro(totals.vatCents)}</span>
              </p>
              <p className="mt-1 font-display text-lg font-bold text-brand-navy">
                Totale {formatEuro(totals.totalCents)}
              </p>
            </div>
          </div>
        )}

        {/* Step 3 — Riepilogo */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-base font-semibold text-brand-navy">Riepilogo</h2>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-brand-muted">Cliente</dt>
                <dd className="font-semibold text-brand-navy">{customer?.name ?? '—'}</dd>
              </div>
              {validLines.map((l, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <dt className="min-w-0 truncate text-brand-ink">
                    {l.description} · {l.quantity} × {formatEuro(l.unitPriceCents)} ({l.vatRate}%)
                  </dt>
                  <dd className="shrink-0 font-medium">{formatEuro(l.totalCents)}</dd>
                </div>
              ))}
              {totals.byRate.map((r) => (
                <div key={r.rate} className="flex justify-between gap-4 text-brand-muted">
                  <dt>IVA {r.rate}% su {formatEuro(r.baseCents)}</dt>
                  <dd>{formatEuro(r.vatCents)}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 border-t border-brand-sand-dark pt-2 font-display text-base font-bold text-brand-navy">
                <dt>Totale</dt>
                <dd>{formatEuro(totals.totalCents)}</dd>
              </div>
            </dl>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="brand-label">Data emissione *</span>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  required
                  className="brand-input mt-1.5"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="brand-label">Note in fattura</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  maxLength={500}
                  placeholder="es. Pagamento a 30 giorni"
                  className="brand-input mt-1.5"
                />
              </label>
            </div>
          </div>
        )}

        {(stepError || (state && !state.ok)) && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">
            {stepError ?? (state && !state.ok ? state.error : null)}
          </p>
        )}

        {/* Navigazione step */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || pending}
            className="flex min-h-11 items-center justify-center rounded-lg border border-brand-sand-dark px-5 text-sm font-semibold text-brand-muted disabled:opacity-40"
          >
            ← Indietro
          </button>

          {step < 2 ? (
            <button type="button" onClick={next} className="brand-btn-primary px-6">
              Avanti →
            </button>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                name="intent"
                value="draft"
                disabled={pending}
                className="flex min-h-11 items-center justify-center rounded-lg border border-brand-blue px-5 text-sm font-semibold text-brand-blue disabled:opacity-60"
              >
                {pending ? 'Salvataggio…' : 'Salva bozza'}
              </button>
              <button
                type="submit"
                name="intent"
                value="sent"
                disabled={pending}
                className="brand-btn-primary px-6"
              >
                {pending ? 'Salvataggio…' : 'Salva e segna inviata'}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
