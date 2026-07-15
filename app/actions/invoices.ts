'use server';

import { revalidatePath } from 'next/cache';
import { InvoiceStatus, Prisma } from '@prisma/client';
import { sessionOrError } from '@/lib/action-auth';
import {
  computeTotals,
  isValidVatRate,
  lineTotalCents,
  parseEuroToCents,
  parseQuantity,
  type ComputedLine,
} from '@/lib/invoices';
import { prisma } from '@/lib/prisma';

export type InvoiceActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };
export type ActionResult = { ok: true } | { ok: false; error: string };

const MAX_LINES = 30;

type RawLine = {
  description?: unknown;
  quantity?: unknown;
  unitPriceEuro?: unknown;
  vatRate?: unknown;
};

function parseLines(json: string): ComputedLine[] | { error: string } {
  let raw: RawLine[];
  try {
    raw = JSON.parse(json);
  } catch {
    return { error: 'Righe fattura non valide.' };
  }
  if (!Array.isArray(raw) || raw.length === 0) {
    return { error: 'Aggiungi almeno una voce alla fattura.' };
  }
  if (raw.length > MAX_LINES) {
    return { error: `Massimo ${MAX_LINES} voci per fattura.` };
  }

  const lines: ComputedLine[] = [];
  for (const [i, r] of raw.entries()) {
    const description = String(r.description ?? '').trim();
    if (!description) return { error: `Voce ${i + 1}: descrizione obbligatoria.` };
    if (description.length > 200) {
      return { error: `Voce ${i + 1}: descrizione troppo lunga (max 200 caratteri).` };
    }
    const quantity = parseQuantity(String(r.quantity ?? ''));
    if (quantity === null) return { error: `Voce ${i + 1}: quantità non valida.` };
    const unitPriceCents = parseEuroToCents(String(r.unitPriceEuro ?? ''));
    if (unitPriceCents === null) return { error: `Voce ${i + 1}: prezzo non valido.` };
    const vatRate = Number(r.vatRate);
    if (!isValidVatRate(vatRate)) return { error: `Voce ${i + 1}: aliquota IVA non valida.` };

    lines.push({
      description,
      quantity,
      unitPriceCents,
      vatRate,
      totalCents: lineTotalCents(quantity, unitPriceCents),
    });
  }
  return lines;
}

function parseIssueDate(raw: string): { date: Date; year: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  // Mezzogiorno UTC: il giorno resta lo stesso in Europe/Rome in ogni stagione.
  const date = new Date(`${raw}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  return { date, year: Number(raw.slice(0, 4)) };
}

/** Aggiorna i dati fiscali del cliente se compilati nel wizard (mai li svuota). */
async function updateCustomerFiscal(customerId: string, formData: FormData) {
  const fields = {
    vatNumber: String(formData.get('customerVatNumber') || '').trim(),
    taxCode: String(formData.get('customerTaxCode') || '').trim(),
    sdiCode: String(formData.get('customerSdiCode') || '').trim(),
    pec: String(formData.get('customerPec') || '').trim(),
  };
  const data = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v.length > 0),
  );
  if (Object.keys(data).length > 0) {
    await prisma.customer.update({ where: { id: customerId }, data });
  }
}

export async function saveInvoice(
  _prev: InvoiceActionResult | null,
  formData: FormData,
): Promise<InvoiceActionResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;

  const invoiceId = String(formData.get('invoiceId') || '').trim() || null;
  const customerId = String(formData.get('customerId') || '').trim();
  const jobId = String(formData.get('jobId') || '').trim() || null;
  const notes = String(formData.get('notes') || '').trim().slice(0, 500) || null;
  const markSent = formData.get('intent') === 'sent';

  if (!customerId) return { ok: false, error: 'Seleziona un cliente.' };

  const issue = parseIssueDate(String(formData.get('issueDate') || ''));
  if (!issue) return { ok: false, error: 'Data di emissione non valida.' };

  const parsed = parseLines(String(formData.get('lines') || ''));
  if ('error' in parsed) return { ok: false, error: parsed.error };
  const totals = computeTotals(parsed);

  try {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, companyId: auth.companyId },
      select: { id: true },
    });
    if (!customer) return { ok: false, error: 'Cliente non valido.' };

    if (jobId) {
      const job = await prisma.job.findFirst({
        where: { id: jobId, companyId: auth.companyId },
        select: { id: true },
      });
      if (!job) return { ok: false, error: 'Intervento non valido.' };
    }

    await updateCustomerFiscal(customerId, formData);

    const baseData = {
      customerId,
      jobId,
      issueDate: issue.date,
      notes,
      subtotalCents: totals.subtotalCents,
      vatCents: totals.vatCents,
      totalCents: totals.totalCents,
      ...(markSent ? { status: 'SENT' as InvoiceStatus, sentAt: new Date() } : {}),
    };
    const linesData = parsed.map((l, position) => ({ ...l, position }));

    if (invoiceId) {
      const existing = await prisma.invoice.findFirst({
        where: { id: invoiceId, companyId: auth.companyId },
        select: { id: true, status: true },
      });
      if (!existing) return { ok: false, error: 'Fattura non trovata.' };
      if (existing.status !== 'DRAFT') {
        return { ok: false, error: 'Solo le bozze possono essere modificate.' };
      }

      await prisma.$transaction([
        prisma.invoiceLine.deleteMany({ where: { invoiceId } }),
        prisma.invoice.update({
          where: { id: invoiceId },
          data: { ...baseData, lines: { create: linesData } },
        }),
      ]);
      revalidatePath('/dashboard/invoices');
      revalidatePath('/dashboard');
      return { ok: true, id: invoiceId };
    }

    // Progressivo per company+anno; l'unique constraint copre la corsa, un retry basta.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const created = await prisma.$transaction(async (tx) => {
          const last = await tx.invoice.findFirst({
            where: { companyId: auth.companyId, year: issue.year },
            orderBy: { number: 'desc' },
            select: { number: true },
          });
          return tx.invoice.create({
            data: {
              ...baseData,
              companyId: auth.companyId,
              year: issue.year,
              number: (last?.number ?? 0) + 1,
              lines: { create: linesData },
            },
            select: { id: true },
          });
        });
        revalidatePath('/dashboard/invoices');
        revalidatePath('/dashboard');
        return { ok: true, id: created.id };
      } catch (err) {
        const isNumberClash =
          err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
        if (!isNumberClash || attempt === 1) throw err;
      }
    }
    return { ok: false, error: 'Errore durante il salvataggio della fattura.' };
  } catch (err) {
    console.error('[saveInvoice]', err);
    return { ok: false, error: 'Errore durante il salvataggio della fattura.' };
  }
}

const ALLOWED_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  DRAFT: ['SENT', 'CANCELLED'],
  SENT: ['PAID', 'CANCELLED'],
  PAID: [],
  CANCELLED: [],
};

export async function setInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus,
): Promise<ActionResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;

  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, companyId: auth.companyId },
      select: { id: true, status: true },
    });
    if (!invoice) return { ok: false, error: 'Fattura non trovata.' };
    if (!ALLOWED_TRANSITIONS[invoice.status].includes(status)) {
      return { ok: false, error: 'Passaggio di stato non consentito.' };
    }

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status,
        ...(status === 'SENT' ? { sentAt: new Date() } : {}),
        ...(status === 'PAID' ? { paidAt: new Date() } : {}),
      },
    });

    revalidatePath('/dashboard/invoices');
    revalidatePath(`/dashboard/invoices/${invoiceId}`);
    revalidatePath('/dashboard');
    return { ok: true };
  } catch (err) {
    console.error('[setInvoiceStatus]', err);
    return { ok: false, error: 'Errore durante il cambio di stato.' };
  }
}

export async function deleteInvoice(invoiceId: string): Promise<ActionResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;

  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, companyId: auth.companyId },
      select: { id: true, status: true },
    });
    if (!invoice) return { ok: false, error: 'Fattura non trovata.' };
    if (invoice.status !== 'DRAFT') {
      return { ok: false, error: 'Solo le bozze possono essere eliminate. Usa "Annulla".' };
    }

    await prisma.invoice.delete({ where: { id: invoiceId } });
    revalidatePath('/dashboard/invoices');
    revalidatePath('/dashboard');
    return { ok: true };
  } catch (err) {
    console.error('[deleteInvoice]', err);
    return { ok: false, error: 'Errore durante l\'eliminazione.' };
  }
}

export async function upsertBillingProfile(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;

  const field = (name: string, max = 120) =>
    String(formData.get(name) || '').trim().slice(0, max) || null;

  const data = {
    businessName: field('businessName'),
    vatNumber: field('vatNumber', 20),
    taxCode: field('taxCode', 20),
    address: field('address', 200),
    pec: field('pec'),
    sdiCode: field('sdiCode', 10),
    iban: field('iban', 34),
  };

  try {
    await prisma.companyProfile.upsert({
      where: { companyId: auth.companyId },
      create: { companyId: auth.companyId, ...data },
      update: data,
    });
    revalidatePath('/dashboard/settings');
    return { ok: true };
  } catch (err) {
    console.error('[upsertBillingProfile]', err);
    return { ok: false, error: 'Errore durante il salvataggio dei dati fatturazione.' };
  }
}
