export const LANDING = {
  hero: {
    eyebrow: 'Gestionale per artigiani tecnici',
    title: 'Smetti di perdere tempo in ufficio.',
    titleAccent: 'Torna in campo.',
    subtitle:
      'Programmi interventi, assegni i tecnici e avvisi i clienti su WhatsApp — ordine nel gestionale, messaggio dove loro già guardano.',
    ctaPrimary: 'Prova gratis — registrati',
    ctaSecondary: 'Vedi la dashboard',
    trust: 'Pensato per idraulici, elettricisti e artigiani. Prova gratuita 14 giorni.',
  },

  product: {
    title: 'La dashboard vera. Niente mockup.',
    subtitle:
      'Questo è l\'interfaccia che usi ogni giorno: agenda, clienti, tecnici e rapportino con firma.',
  },

  problems: {
    title: 'Ti riconosci?',
    subtitle: 'Ogni giorno senza un sistema ti costa soldi, stress e reputazione.',
    items: [
      {
        pain: 'Il cliente chiama tre volte',
        detail:
          '"A che ora arrivi?" — mentre sei sotto un lavandino. Un messaggio WhatsApp automatico quando parti e il telefono tace.',
        icon: 'phone',
      },
      {
        pain: 'Interventi dimenticati o sovrapposti',
        detail:
          'Appunti su carta, chat sparsi, doppie prenotazioni. Un buco in agenda = un cliente perso.',
        icon: 'calendar',
      },
      {
        pain: 'Troppo tempo al telefono, poco in cantiere',
        detail:
          'Coordini, richiami, spieghi. L\'ufficio invisibile ti ruba ore fatturabili ogni settimana.',
        icon: 'clock',
      },
      {
        pain: 'Niente prova scritta del lavoro fatto',
        detail:
          'Senza rapportino firmato e foto, contestazioni e "non era incluso". Fine intervento = PDF al cliente.',
        icon: 'money',
      },
    ],
  },

  solution: {
    title: 'Una dashboard. Zero fronzoli.',
    subtitle: 'Quattro azioni che risolvono il caos quotidiano.',
    steps: [
      {
        step: '01',
        title: 'Programma',
        text: 'Inserisci intervento, cliente e orario. Oggi, settimana o storico — tutto in un posto.',
      },
      {
        step: '02',
        title: 'Assegna',
        text: 'Solo? Va a te automaticamente. Team? Scegli il tecnico — riceve avviso su WhatsApp.',
      },
      {
        step: '03',
        title: 'Avvisa su WhatsApp',
        text: 'Quando parti, il cliente riceve il messaggio. In Italia leggono WhatsApp, non gli SMS.',
      },
      {
        step: '04',
        title: 'Rapportino',
        text: 'Firma del cliente, note e foto sul lavoro. PDF da consegnare o archiviare.',
      },
    ],
  },

  testimonials: {
    title: 'Chi lo sta provando',
    subtitle: 'Artigiani in beta — feedback veri, niente numeri inventati.',
    items: [
      {
        quote:
          'Prima rispondevo al telefono con le mani sporche di rame. Ora mando in partenza e il cliente smette di chiamare.',
        name: 'Gennaro M.',
        role: 'Idraulico',
        city: 'Fuorigrotta, Napoli',
      },
      {
        quote:
          'Ho due ragazzi in giro. Finalmente vedo chi è libero senza aprire cinque chat WhatsApp diverse.',
        name: 'Luca B.',
        role: 'Elettricista',
        city: 'Monza',
      },
      {
        quote:
          'Il rapportino con firma mi ha tolto due contestazioni in un mese. Vale più del prezzo dell\'abbonamento.',
        name: 'Sara V.',
        role: 'Frigorista',
        city: 'Bologna',
      },
    ],
  },

  faq: {
    title: 'Domande frequenti',
    items: [
      {
        q: 'Quanto dura la prova gratuita?',
        a: '14 giorni con tutte le funzioni. Nessuna carta richiesta per registrarti. Se attivi Stripe, il piano parte dopo la prova.',
      },
      {
        q: 'Posso disdire quando voglio?',
        a: 'Sì. Abbonamento mensile senza vincolo. Annuale scontato ma disdicibile alla scadenza — niente penali nascoste.',
      },
      {
        q: 'Dove finiscono i dati dei miei clienti?',
        a: 'Su database PostgreSQL in UE (Supabase). Ogni azienda è isolata. Non vendiamo dati. Dettagli in Privacy Policy.',
      },
      {
        q: 'Funziona senza internet in cantina?',
        a: 'Serve connessione per sincronizzare agenda e inviare WhatsApp. Puoi compilare il rapportino sul telefono e inviarlo quando torni in 4G.',
      },
      {
        q: 'WhatsApp o SMS?',
        a: 'WhatsApp è il canale principale (Business API). SMS resta come backup se configuri Twilio.',
      },
      {
        q: 'Si collega a Fatture in Cloud o Aruba?',
        a: 'Non ancora integrato. È in roadmap: export interventi completati verso il tuo gestionale fatture. Per ora usi il rapportino PDF.',
      },
      {
        q: 'Posso parlare con qualcuno prima di iscrivermi?',
        a: 'Sì. Scrivici su WhatsApp dal footer — rispondiamo noi, non un bot.',
      },
    ],
  },

  audience: {
    title: 'Fatto per chi lavora con le mani',
    subtitle: 'Non per le multinazionali. Per chi ha bisogno di ordine, non di un consulente IT.',
    segments: [
      {
        title: 'Operatore singolo',
        text: 'Idraulico, elettricista, frigorista — gestisci tutto da solo e vuoi sembrare organizzato.',
      },
      {
        title: 'Piccola impresa',
        text: '2–5 tecnici in giro. Serve sapere chi è libero, chi è impegnato, cosa fare dopo.',
      },
      {
        title: 'Impresa in crescita',
        text: 'Più squadre, più zone. Controllo operativo senza software enterprise.',
      },
    ],
  },

  pricingIntro: {
    title: 'Prezzi onesti. Niente sorprese.',
    subtitle:
      'Un intervento perso costa €150. Trades Dispatch da €20/mese. Piano annuale: 2 mesi gratis.',
  },

  finalCta: {
    title: 'Domani mattina apri la dashboard e sai già cosa fare.',
    subtitle: 'Registrati in 2 minuti. Prova 14 giorni. Parla con noi su WhatsApp se hai dubbi.',
    cta: 'Crea il tuo account',
  },
} as const;