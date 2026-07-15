import { dayRangeInRome, formatTimeRome, romeDateString } from '@/lib/dates';
import { sendJobReminderSms } from '@/lib/notifications';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/** Cron Vercel: promemoria SMS per interventi di domani. */
export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const tomorrowStr = romeDateString(tomorrow);
  const { start, end } = dayRangeInRome(tomorrowStr);

  const jobs = await prisma.job.findMany({
    where: {
      status: 'SCHEDULED',
      scheduledAt: { gte: start, lte: end },
      customer: { phone: { not: null } },
    },
    include: {
      customer: { select: { name: true, phone: true } },
    },
    take: 200,
  });

  let sent = 0;
  for (const job of jobs) {
    if (!job.customer.phone) continue;
    const label = formatTimeRome(job.scheduledAt);
    await sendJobReminderSms({
      to: job.customer.phone,
      customerName: job.customer.name,
      jobTitle: job.title,
      scheduledLabel: label,
    });
    sent += 1;
  }

  return NextResponse.json({ ok: true, sent, date: tomorrowStr });
}