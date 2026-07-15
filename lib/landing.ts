export const LANDING = {
  hero: {
    eyebrow: 'Gestionale per artigiani tecnici',
    title: 'Smetti di perdere tempo in ufficio.',
    titleAccent: 'Torna in campo.',
    subtitle:
      'Trades Dispatch ti fa programmare interventi, assegnare i tecnici e tenere aggiornati i clienti — senza Excel, senza caos su WhatsApp, senza software da multinazionale.',
    ctaPrimary: 'Prova gratis — registrati',
    ctaSecondary: 'Accedi',
    trust: 'Pensato per idraulici, elettricisti e artigiani come te. Da €20/mese.',
  },

  problems: {
    title: 'Ti riconosci?',
    subtitle: 'Ogni giorno senza un sistema ti costa soldi, stress e reputazione.',
    items: [
      {
        pain: 'Il cliente chiama tre volte',
        detail:
          '"A che ora arrivi?" — mentre sei sotto un lavandino. Senza un aggiornamento automatico, sembri disorganizzato anche quando non lo sei.',
        icon: 'phone',
      },
      {
        pain: 'Interventi dimenticati o sovrapposti',
        detail:
          'Appunti su carta, messaggi sparsi, doppie prenotazioni. Un buco in agenda = un cliente perso e una mattinata buttata.',
        icon: 'calendar',
      },
      {
        pain: 'Troppo tempo al telefono, poco in cantiere',
        detail:
          'Coordini, richiami, spieghi, riprogrammi. L\'ufficio invisibile ti ruba ore di lavoro fatturabile ogni settimana.',
        icon: 'clock',
      },
      {
        pain: 'Software complicati e costosi',
        detail:
          'CRM da €100+, formazione infinita, funzioni che non userai mai. Tu vuoi solo sapere chi va dove, oggi.',
        icon: 'money',
      },
    ],
  },

  solution: {
    title: 'Una dashboard. Zero fronzoli.',
    subtitle: 'Tre azioni che risolvono l\'80% del caos quotidiano.',
    steps: [
      {
        step: '01',
        title: 'Programma',
        text: 'Inserisci l\'intervento, il cliente e l\'orario. Tutto in un posto, visibile subito.',
      },
      {
        step: '02',
        title: 'Assegna',
        text: 'Sei solo? Va automaticamente a te. Hai un team? Scegli il tecnico con un click.',
      },
      {
        step: '03',
        title: 'Avvisa',
        text: 'Quando parti, il cliente riceve un SMS. Meno chiamate, più professionalità.',
      },
    ],
  },

  audience: {
    title: 'Fatto per chi lavora con le mani',
    subtitle: 'Non per le multinazionali. Per chi ha bisogno di ordine, non di un consulente IT.',
    segments: [
      {
        title: 'Operatore singolo',
        text: 'Idraulico, elettricista, frigorista — gestisci tutto da solo e vuoi sembrare un\'azienda organizzata.',
      },
      {
        title: 'Piccola impresa',
        text: '2–5 tecnici in giro per la città. Serve sapere chi è libero, chi è impegnato, cosa fare dopo.',
      },
      {
        title: 'Impresa in crescita',
        text: 'Più squadre, più zone, più clienti. Vuoi controllo senza pagare software enterprise.',
      },
    ],
  },

  pricingIntro: {
    title: 'Prezzi onesti. Niente sorprese.',
    subtitle:
      'Un intervento perso per disorganizzazione costa facilmente €150. Trades Dispatch parte da €20 al mese. Fai tu i conti.',
  },

  finalCta: {
    title: 'Domani mattina apri la dashboard e sai già cosa fare.',
    subtitle: 'Registrati in 2 minuti. Scegli se lavori da solo o con un team.',
    cta: 'Crea il tuo account',
  },
} as const;