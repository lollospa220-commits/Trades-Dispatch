/** WhatsApp Business Cloud API — canale principale notifiche in Italia. */

function normalizeWaPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('39')) return digits;
  if (digits.length >= 9 && digits.length <= 10) return `39${digits}`;
  return digits;
}

export async function sendWhatsAppText(to: string, body: string): Promise<boolean> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId) {
    console.info('[sendWhatsApp stub]', { to, body });
    return false;
  }

  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: normalizeWaPhone(to),
      type: 'text',
      text: { body },
    }),
  });

  if (!res.ok) {
    console.error('[sendWhatsApp]', await res.text());
    return false;
  }
  return true;
}