import { formatDateRome } from '@/lib/dates';
import { getSession } from '@/lib/auth';
import { invoiceNumberLabel } from '@/lib/invoices';
import { prisma } from '@/lib/prisma';
import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from 'pdf-lib';
import { NextResponse } from 'next/server';

const NAVY = rgb(0.06, 0.11, 0.18);
const MUTED = rgb(0.4, 0.45, 0.5);
const LINE = rgb(0.85, 0.83, 0.8);

// Importi senza Intl: NBSP/spazi speciali non sono garantiti in WinAnsi.
function euro(cents: number): string {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const int = Math.floor(abs / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}${int},${String(abs % 100).padStart(2, '0')} EUR`;
}

function qty(value: number): string {
  return String(value).replace('.', ',');
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { id } = await params;
  const invoice = await prisma.invoice.findFirst({
    where: { id, companyId: session.companyId },
    include: {
      company: { select: { name: true, email: true, billingProfile: true } },
      customer: true,
      lines: { orderBy: { position: 'asc' } },
    },
  });
  if (!invoice) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const pageSize: [number, number] = [595, 842]; // A4
  const margin = 50;
  const width = pageSize[0] - margin * 2;
  let page = pdf.addPage(pageSize);
  let y = 842 - margin;

  const text = (
    t: string,
    opts: { x?: number; size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; align?: 'right'; rightEdge?: number } = {},
  ) => {
    const f = opts.font ?? font;
    const size = opts.size ?? 10;
    let x = opts.x ?? margin;
    if (opts.align === 'right') {
      const w = f.widthOfTextAtSize(t, size);
      x = (opts.rightEdge ?? pageSize[0] - margin) - w;
    }
    page.drawText(t, { x, y, size, font: f, color: opts.color ?? NAVY });
  };

  const hr = () => {
    page.drawLine({
      start: { x: margin, y: y + 4 },
      end: { x: pageSize[0] - margin, y: y + 4 },
      thickness: 0.7,
      color: LINE,
    });
  };

  const ensureSpace = (needed: number) => {
    if (y - needed < 70) {
      page = pdf.addPage(pageSize);
      y = 842 - margin;
    }
  };

  const profile = invoice.company.billingProfile;
  const issuerName = profile?.businessName || invoice.company.name;

  // ── Intestazione emittente
  text('FATTURA', { size: 20, font: bold });
  text(`n. ${invoiceNumberLabel(invoice.number, invoice.year)}`, {
    size: 14,
    font: bold,
    align: 'right',
  });
  y -= 16;
  text(`Data emissione: ${formatDateRome(invoice.issueDate)}`, { size: 10, color: MUTED, align: 'right' });
  y -= 26;

  text(issuerName, { size: 12, font: bold });
  y -= 14;
  const issuerRows = [
    profile?.address,
    profile?.vatNumber ? `P.IVA ${profile.vatNumber}` : null,
    profile?.taxCode ? `C.F. ${profile.taxCode}` : null,
    profile?.pec ? `PEC ${profile.pec}` : null,
    profile?.iban ? `IBAN ${profile.iban}` : null,
  ].filter((v): v is string => Boolean(v));
  if (issuerRows.length === 0) {
    text('Completa i dati fatturazione in Impostazioni per l\'intestazione completa.', {
      size: 9,
      color: MUTED,
    });
    y -= 12;
  }
  for (const row of issuerRows) {
    text(row, { size: 10, color: MUTED });
    y -= 12;
  }

  // ── Destinatario
  y -= 14;
  text('Destinatario', { size: 9, font: bold, color: MUTED });
  y -= 13;
  text(invoice.customer.name, { size: 12, font: bold });
  y -= 14;
  const customerRows = [
    invoice.customer.address,
    invoice.customer.vatNumber ? `P.IVA ${invoice.customer.vatNumber}` : null,
    invoice.customer.taxCode ? `C.F. ${invoice.customer.taxCode}` : null,
    invoice.customer.sdiCode ? `SDI ${invoice.customer.sdiCode}` : null,
    invoice.customer.pec ? `PEC ${invoice.customer.pec}` : null,
  ].filter((v): v is string => Boolean(v));
  for (const row of customerRows) {
    text(row, { size: 10, color: MUTED });
    y -= 12;
  }

  // ── Tabella righe
  y -= 20;
  const cols = {
    desc: margin,
    qty: margin + width * 0.58,
    price: margin + width * 0.7,
    vat: margin + width * 0.85,
    total: pageSize[0] - margin,
  };
  hr();
  y -= 12;
  text('Descrizione', { size: 9, font: bold, color: MUTED });
  text('Qta', { x: cols.qty, size: 9, font: bold, color: MUTED });
  text('Prezzo', { size: 9, font: bold, color: MUTED, align: 'right', rightEdge: cols.vat - 14 });
  text('IVA', { x: cols.vat, size: 9, font: bold, color: MUTED });
  text('Importo', { size: 9, font: bold, color: MUTED, align: 'right' });
  y -= 8;
  hr();
  y -= 14;

  for (const line of invoice.lines) {
    ensureSpace(30);
    const desc = line.description.length > 58 ? `${line.description.slice(0, 57)}…` : line.description;
    text(desc, { size: 10 });
    text(qty(Number(line.quantity)), { x: cols.qty, size: 10 });
    text(euro(line.unitPriceCents), { size: 10, align: 'right', rightEdge: cols.vat - 14 });
    text(`${line.vatRate}%`, { x: cols.vat, size: 10 });
    text(euro(line.totalCents), { size: 10, align: 'right' });
    y -= 18;
  }

  hr();
  y -= 16;

  // ── Totali
  ensureSpace(80);
  const totalsRight = pageSize[0] - margin;
  text('Imponibile', { x: cols.price, size: 10, color: MUTED });
  text(euro(invoice.subtotalCents), { size: 10, align: 'right', rightEdge: totalsRight });
  y -= 14;
  text('IVA', { x: cols.price, size: 10, color: MUTED });
  text(euro(invoice.vatCents), { size: 10, align: 'right', rightEdge: totalsRight });
  y -= 16;
  text('TOTALE', { x: cols.price, size: 12, font: bold });
  text(euro(invoice.totalCents), { size: 12, font: bold, align: 'right', rightEdge: totalsRight });
  y -= 24;

  if (invoice.notes) {
    ensureSpace(40);
    text('Note:', { size: 9, font: bold, color: MUTED });
    y -= 12;
    for (const part of invoice.notes.split('\n').slice(0, 4)) {
      text(part.slice(0, 95), { size: 9, color: MUTED });
      y -= 11;
    }
  }

  page.drawText('Generato da Opifice — documento interno, non trasmesso al Sistema di Interscambio (SDI).', {
    x: margin,
    y: 40,
    size: 8,
    font,
    color: MUTED,
  });

  const bytes = await pdf.save();
  const filename = `fattura-${invoice.year}-${String(invoice.number).padStart(4, '0')}.pdf`;
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
