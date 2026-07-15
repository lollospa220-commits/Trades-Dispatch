export type PricingPlan = {
  id: 'solo' | 'team' | 'pro';
  name: string;
  tagline: string;
  price: number;
  annualPrice: number;
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
    annualPrice: 200,
    period: 'mese',
    audience: 'Per l\'artigiano che lavora da solo.',
    features: [
      '1 operatore (tu)',
      'Agenda oggi, settimana e storico',
      'Avviso WhatsApp al cliente in partenza',
      'Rubrica clienti illimitata',
      'Rapportino PDF con firma cliente',
      'Prova 14 giorni — disdici quando vuoi',
    ],
    cta: 'Inizia con Solo',
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'Per chi ha più richieste o un piccolo gruppo',
    price: 49,
    annualPrice: 490,
    period: 'mese',
    highlight: true,
    badge: 'Più scelto',
    audience: 'Piccole imprese fino a 5 operatori.',
    features: [
      'Fino a 5 tecnici',
      'Assegnazione + avviso WhatsApp al tecnico',
      'Vista team su tutti gli interventi',
      'Tutto del piano Solo',
      'Foto lavoro sul rapportino',
      'Supporto via WhatsApp ed email',
    ],
    cta: 'Scegli Team',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Controllo totale per chi scala',
    price: 69,
    annualPrice: 690,
    period: 'mese',
    audience: 'Imprese strutturate con più squadre.',
    features: [
      'Operatori illimitati',
      'Storico completo ed export CSV',
      'Rapportini illimitati con foto',
      'Tutto del piano Team',
      'Onboarding dedicato',
      'Priorità integrazioni (fatturazione elettronica)',
    ],
    cta: 'Passa a Pro',
  },
];

export const PRICE_ANCHOR = {
  lostJob: 150,
  monthlyCoffee: 3,
  headline: 'Meno di un caffè al giorno. Molto meno di un intervento perso.',
};

export const ANNUAL_SAVINGS_MONTHS = 2;