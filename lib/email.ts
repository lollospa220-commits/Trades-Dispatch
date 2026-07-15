type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'Opifice <noreply@opifice.it>';

  if (!apiKey) {
    console.info('[sendEmail stub]', { to, subject });
    return false;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    console.error('[sendEmail]', await res.text());
    return false;
  }
  return true;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await sendEmail({
    to,
    subject: 'Reimposta la password — Opifice',
    html: `
      <p>Ciao,</p>
      <p>Hai richiesto di reimpostare la password. Clicca il link (valido 1 ora):</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Se non sei stato tu, ignora questa email.</p>
    `,
  });
}

export async function sendWelcomeEmail(to: string, companyName: string): Promise<void> {
  await sendEmail({
    to,
    subject: 'Benvenuto su Opifice',
    html: `
      <p>Ciao ${companyName},</p>
      <p>Account creato. Entra in dashboard e programma il primo intervento.</p>
      <p>Buon lavoro in campo.</p>
    `,
  });
}