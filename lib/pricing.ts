export type PricingPlan = {
  id: 'solo' | 'team' | 'pro';
  name: string;
  tagline: string;
  price: number;
  period: string;
  highlight?: boolean;
  badge?: string;
  audience: string;
  features: string[];
  cta: string;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'solo',
    name: 'Solo',
    tagline: 'Tutto il necessario per partire',
    price: 20,
    period: 'mese',
    audience: 'Per l\'artigiano che lavora da solo e vuole smettere di gestire tutto da WhatsApp.',
    features: [
      '1 operatore (tu)',
      'Interventi e clienti illimitati',
      'Agenda giornaliera chiara',
      'Notifica SMS al cliente (in partenza)',
      'Accesso da telefono e PC',
      'Nessun vincolo — disdici quando vuoi',
    ],
    cta: 'Inizia con Solo',
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'Per chi ha più richieste o un piccolo gruppo',
    price: 49,
    period: 'mese',
    highlight: true,
    badge: 'Più scelto',
    audience: 'Per artigiani con molte chiamate o piccole imprese fino a 5 operatori.',
    features: [
      'Fino a 5 operatori',
      'Assegnazione interventi al team',
      'Vista unica di tutti gli interventi',
      'Tutto del piano Solo',
      'Supporto prioritario via email',
      'Multi-tenant: ogni azienda isolata',
    ],
    cta: 'Scegli Team',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Controllo totale per chi scala',
    price: 69,
    period: 'mese',
    audience: 'Per imprese strutturate, più squadre o chi vuole il massimo controllo operativo.',
    features: [
      'Operatori illimitati',
      'Gestione multi-sede (in arrivo)',
      'Report e storico avanzato (in arrivo)',
      'Tutto del piano Team',
      'Onboarding dedicato',
      'Priorità su nuove funzioni',
    ],
    cta: 'Passa a Pro',
  },
];

export const PRICE_ANCHOR = {
  lostJob: 150,
  monthlyCoffee: 3,
  headline: 'Meno di un caffè al giorno. Molto meno di un intervento perso.',
};