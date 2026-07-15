// Helper fatture condivisi client/server. Importi sempre in centesimi (Int).

export const VAT_RATES = [22, 10, 4, 0] as const;
export type VatRate = (typeof VAT_RATES)[number];

export const INVOICE_STATUS_LABEL = {
  DRAFT: 'Bozza',
  SENT: 'Inviata',
  PAID: 'Pagata',
  CANCELLED: 'Annullata',
} as const;

export type InvoiceStatusKey = keyof typeof INVOICE_STATUS_LABEL;

export const INVOICE_STATUS_STYLE: Record<InvoiceStatusKey, string> = {
  DRAFT: 'bg-brand-sand text-brand-ink ring-brand-sand-dark',
  SENT: 'bg-brand-amber-light text-brand-amber ring-brand-amber/30',
  PAID: 'bg-brand-teal-light text-brand-teal ring-brand-teal/30',
  CANCELLED: 'bg-red-50 text-red-600 ring-red-200',
};

/** Riga fattura lato wizard: quantity come stringa per input controllati. */
export type WizardLine = {
  description: string;
  quantity: string;
  unitPriceEuro: string;
  vatRate: VatRate;
};

export function isValidVatRate(rate: number): rate is VatRate {
  return (VAT_RATES as readonly number[]).includes(rate);
}

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(
    cents / 100,
  );
}

/** "1.234,56" o "10" → centesimi; null se non parsabile. */
export function parseEuroToCents(raw: string): number | null {
  const cleaned = raw.trim().replace(/\./g, '').replace(',', '.');
  if (!cleaned) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

export function parseQuantity(raw: string): number | null {
  const value = Number(String(raw).trim().replace(',', '.'));
  if (!Number.isFinite(value) || value <= 0 || value > 99999) return null;
  return Math.round(value * 100) / 100;
}

export function lineTotalCents(quantity: number, unitPriceCents: number): number {
  return Math.round(quantity * unitPriceCents);
}

export type ComputedLine = {
  description: string;
  quantity: number;
  unitPriceCents: number;
  vatRate: VatRate;
  totalCents: number;
};

export function computeTotals(lines: ComputedLine[]): {
  subtotalCents: number;
  vatCents: number;
  totalCents: number;
  byRate: { rate: VatRate; baseCents: number; vatCents: number }[];
} {
  const byRateMap = new Map<VatRate, number>();
  for (const l of lines) {
    byRateMap.set(l.vatRate, (byRateMap.get(l.vatRate) ?? 0) + l.totalCents);
  }
  const byRate = [...byRateMap.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([rate, baseCents]) => ({
      rate,
      baseCents,
      vatCents: Math.round((baseCents * rate) / 100),
    }));
  const subtotalCents = byRate.reduce((s, r) => s + r.baseCents, 0);
  const vatCents = byRate.reduce((s, r) => s + r.vatCents, 0);
  return { subtotalCents, vatCents, totalCents: subtotalCents + vatCents, byRate };
}

export function invoiceNumberLabel(number: number, year: number): string {
  return `${number}/${year}`;
}
