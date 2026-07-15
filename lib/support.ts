/** Numero WhatsApp supporto — visibile in footer e FAQ. */
export function whatsappSupportNumber(): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT?.trim();
  return raw || null;
}

export function whatsappSupportUrl(message?: string): string | null {
  const num = whatsappSupportNumber();
  if (!num) return null;
  const digits = num.replace(/\D/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${text}`;
}

export function whatsappSupportDisplay(): string | null {
  const num = whatsappSupportNumber();
  if (!num) return null;
  return num.startsWith('+') ? num : `+${num}`;
}