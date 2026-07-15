/**
 * Notifiche cliente e tecnico — WhatsApp prima, SMS Twilio come backup.
 */

import { sendWhatsAppText } from '@/lib/whatsapp';

export type TechnicianEnRoutePayload = {
  to: string;
  customerName: string;
  technicianName: string;
  jobTitle: string;
};

export type JobReminderPayload = {
  to: string;
  customerName: string;
  jobTitle: string;
  scheduledLabel: string;
};

function normalizePhoneE164(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('39') && digits.length >= 10) return `+${digits}`;
  if (digits.length >= 9 && digits.length <= 10) return `+39${digits}`;
  if (raw.startsWith('+')) return raw;
  return `+${digits}`;
}

async function sendMessage(to: string, body: string): Promise<void> {
  const wa = await sendWhatsAppText(to, body);
  if (wa) return;
  await sendSmsFallback(to, body);
}

async function sendSmsFallback(to: string, body: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) {
    console.info('[notify stub]', { to, body });
    return false;
  }

  const phone = normalizePhoneE164(to);
  const auth = Buffer.from(`${sid}:${token}`).toString('base64');
  const params = new URLSearchParams({ To: phone, From: from, Body: body });

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!res.ok) console.error('[sendSms]', await res.text());
  return res.ok;
}

export async function sendTechnicianEnRouteSms(payload: TechnicianEnRoutePayload): Promise<void> {
  const body = `Ciao ${payload.customerName}, ${payload.technicianName} è in partenza per: ${payload.jobTitle}. — Trades Dispatch`;
  await sendMessage(payload.to, body);
}

export async function sendJobReminderSms(payload: JobReminderPayload): Promise<void> {
  const body = `Promemoria: domani alle ${payload.scheduledLabel} — intervento "${payload.jobTitle}". — Trades Dispatch`;
  await sendMessage(payload.to, body);
}

export async function sendTechnicianAssignedSms(
  to: string,
  technicianName: string,
  jobTitle: string,
  scheduledLabel: string,
): Promise<void> {
  const body = `${technicianName}, nuovo intervento: ${jobTitle} — ${scheduledLabel}. — Trades Dispatch`;
  await sendMessage(to, body);
}