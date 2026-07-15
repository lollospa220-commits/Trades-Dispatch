/**
 * ─── OPIFICE · BRAND IDENTITY ───────────────────────────────────────────────
 *
 * NOME
 *   Opifice — gestionale per artigiani e tecnici in Italia. Sigla: Opi.
 *
 * POSIZIONAMENTO
 *   Gestionale senza fronzoli per idraulici, elettricisti e artigiani tecnici.
 *   Elimina il lavoro d'ufficio: programma interventi, assegna tecnici, avvisa i clienti.
 *
 * TAGLINE
 *   "Meno ufficio. Più campo."
 *
 * TONO DI VOCE
 *   • Diretto — frasi brevi, verbi d'azione ("Assegna", "Programma", "Avvisa")
 *   • Pratico — zero buzzword, niente "soluzione innovativa" o "ecosistema"
 *   • Rassicurante — professionale ma non freddo; parliamo da pari agli artigiani
 *   • Onesto — prezzi indicativi, stati chiari, niente promesse magiche
 *   • Italiano — UI e copy in italiano
 *
 * PALETTE
 *   Navy   #0F1C2E — fiducia, testo forte, header
 *   Blue   #1E4D8C — azioni primarie, link
 *   Amber  #E87B35 — urgenza campo, "in corso", CTA secondaria
 *   Teal   #0D9488 — completato, successo
 *   Sand   #F8F6F3 — sfondo caldo (non grigio freddo)
 */

export const BRAND = {
  name: 'Opifice',
  shortName: 'Opi',
  tagline: 'Meno ufficio. Più campo.',
  descriptor:
    'Il gestionale per programmare interventi, assegnare i tecnici e aggiornare i clienti — senza fronzoli.',
  siteUrl: 'https://opifice.it',
  siteUrlAlt: 'https://opifice.app',
  colors: {
    navy: '#0F1C2E',
    blue: '#1E4D8C',
    amber: '#E87B35',
    teal: '#0D9488',
    sand: '#F8F6F3',
    slate: '#64748B',
  },
} as const;

export const VOICE = {
  examples: {
    ctaPrimary: 'Crea intervento',
    ctaLogin: 'Entra in dashboard',
    emptyState: 'Nessun intervento oggi. Programma il primo.',
    smsStub: 'In partenza → messaggio WhatsApp al cliente automatico.',
  },
} as const;