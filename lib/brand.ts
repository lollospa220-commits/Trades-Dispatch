/**
 * ─── TRADES DISPATCH · BRAND IDENTITY ───────────────────────────────────────
 *
 * NOME
 *   Trades Dispatch — inglese B2B SaaS (credibilità software), comprensibile
 *   nel settore artigianale italiano. Sigla: TD.
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
 *   • Italiano — UI e copy in italiano; termini tecnici solo se utili (dispatch, dashboard)
 *
 * DA EVITARE
 *   Startup hype, emoji eccessive, tono corporativo distante, gergo AI
 *
 * PALETTE
 *   Navy   #0F1C2E — fiducia, testo forte, header
 *   Blue   #1E4D8C — azioni primarie, link
 *   Amber  #E87B35 — urgenza campo, "in corso", CTA secondaria
 *   Teal   #0D9488 — completato, successo
 *   Sand   #F8F6F3 — sfondo caldo (non grigio freddo)
 *
 * TIPOGRAFIA
 *   Display: Plus Jakarta Sans — titoli, logo wordmark
 *   Body:    Source Sans 3 — UI, tabelle, form
 */

export const BRAND = {
  name: 'Trades Dispatch',
  shortName: 'TD',
  tagline: 'Meno ufficio. Più campo.',
  descriptor:
    'Il gestionale per programmare interventi, assegnare i tecnici e aggiornare i clienti — senza fronzoli.',
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
  /** Esempi di microcopy coerente con il brand */
  examples: {
    ctaPrimary: 'Crea intervento',
    ctaLogin: 'Entra in dashboard',
    emptyState: 'Nessun intervento oggi. Programma il primo.',
    smsStub: 'In partenza → messaggio WhatsApp al cliente automatico.',
  },
} as const;