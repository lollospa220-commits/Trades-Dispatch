import { formatDateRome, formatTimeRome } from '@/lib/dates';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { id } = await params;
  const job = await prisma.job.findFirst({
    where: { id, companyId: session.companyId },
    include: {
      customer: true,
      technician: true,
      report: true,
      company: true,
    },
  });
  if (!job) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const black = rgb(0.06, 0.11, 0.18);

  let y = 800;
  const line = (text: string, size = 11, f = font) => {
    page.drawText(text.slice(0, 90), { x: 50, y, size, font: f, color: black });
    y -= size + 8;
  };

  line('RAPPORTINO INTERVENTO', 16, bold);
  line(`Azienda: ${job.company.name}`, 12, bold);
  y -= 8;
  line(`Intervento: ${job.title}`);
  line(`Cliente: ${job.customer.name}`);
  if (job.customer.address) line(`Indirizzo: ${job.customer.address}`);
  line(`Data: ${formatDateRome(job.scheduledAt)} ${formatTimeRome(job.scheduledAt)}`);
  if (job.technician) line(`Tecnico: ${job.technician.name}`);
  y -= 8;
  line('Lavoro eseguito:', 12, bold);
  const notes = job.report?.workNotes || '—';
  notes.split('\n').forEach((part) => line(part));

  if (job.report?.signedByName) {
    y -= 8;
    line(`Firmato da: ${job.report.signedByName}`);
  }

  if (job.report?.signatureData?.startsWith('data:image')) {
    try {
      const b64 = job.report.signatureData.split(',')[1];
      const imgBytes = Buffer.from(b64, 'base64');
      const png = await pdf.embedPng(imgBytes);
      const dims = png.scale(0.35);
      page.drawImage(png, { x: 50, y: Math.max(80, y - 80), width: dims.width, height: dims.height });
    } catch {
      /* firma non embeddabile */
    }
  }

  page.drawText('— Trades Dispatch', { x: 50, y: 40, size: 9, font, color: rgb(0.4, 0.45, 0.5) });

  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="rapportino-${id}.pdf"`,
    },
  });
}