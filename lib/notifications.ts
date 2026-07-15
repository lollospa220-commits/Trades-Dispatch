/**
 * Punto unico per le notifiche al cliente finale.
 * Chiamato da `app/actions/jobs.ts` quando un intervento passa a IN_PROGRESS.
 */

export type TechnicianEnRoutePayload = {
  to: string;
  customerName: string;
  technicianName: string;
  jobTitle: string;
};

/** Stub — sostituire con Twilio, MessageBird, Vonage, ecc. */
export async function sendTechnicianEnRouteSms(payload: TechnicianEnRoutePayload): Promise<void> {
  const body = `Ciao ${payload.customerName}, ${payload.technicianName} è in partenza per: ${payload.jobTitle}. — Trades Dispatch`;

  // Esempio Twilio:
  // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  // await client.messages.create({
  //   body,
  //   from: process.env.TWILIO_PHONE_NUMBER!,
  //   to: payload.to,
  // });

  console.info('[sendTechnicianEnRouteSms]', { to: payload.to, body });
}