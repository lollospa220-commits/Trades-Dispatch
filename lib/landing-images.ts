export type LandingImageMeta = { src: string; alt: string };

/** Catalogo immagini landing — ogni sezione usa foto diverse */
export const LANDING_IMAGES = {
  hero: {
    src: '/landing/hero.jpg',
    alt: 'Operatore tecnico che esce dal furgone per un intervento',
  },
  solo: {
    src: '/landing/solo-operator.jpg',
    alt: 'Idraulico che consulta la tablet in cantiere',
  },
  team: {
    src: '/landing/team-van.jpg',
    alt: 'Piccolo team di tecnici davanti al furgone aziendale',
  },
  electrician: {
    src: '/landing/electrician.jpg',
    alt: 'Elettricista che ispeziona un quadro elettrico',
  },
  plumber: {
    src: '/landing/plumber.jpg',
    alt: 'Idraulico sotto il lavandino durante un intervento',
  },
  hvac: {
    src: '/landing/hvac.jpg',
    alt: 'Tecnico climatizzazione su tetto durante manutenzione',
  },
  womanPlumber: {
    src: '/landing/woman-plumber.jpg',
    alt: 'Idraulica professionista in cantiere bagno',
  },
  blueprint: {
    src: '/landing/blueprint.jpg',
    alt: 'Due operai che consultano un progetto in cantiere',
  },
  wiresCloseup: {
    src: '/landing/wires-closeup.jpg',
    alt: 'Dettaglio connessione cavi elettrici',
  },
  fridgeTech: {
    src: '/landing/fridge-tech.jpg',
    alt: 'Frigorista che controlla un compressore industriale',
  },
  carpenter: {
    src: '/landing/carpenter.jpg',
    alt: 'Falegname che misura una struttura in legno',
  },
  dispatchStreet: {
    src: '/landing/dispatch-street.jpg',
    alt: 'Tecnico che carica attrezzi sul furgone in strada',
  },
} as const satisfies Record<string, LandingImageMeta>;

export const AUDIENCE_IMAGES: LandingImageMeta[] = [
  LANDING_IMAGES.solo,
  LANDING_IMAGES.blueprint,
  LANDING_IMAGES.carpenter,
];

export const HERO_AVATARS: LandingImageMeta[] = [
  LANDING_IMAGES.womanPlumber,
  LANDING_IMAGES.hvac,
  LANDING_IMAGES.fridgeTech,
];

export const GALLERY_ITEMS: (LandingImageMeta & { role: string; caption: string })[] = [
  { ...LANDING_IMAGES.solo, role: 'Idraulico', caption: 'Da solo, organizzato' },
  { ...LANDING_IMAGES.womanPlumber, role: 'Idraulica', caption: 'In cantiere ogni giorno' },
  { ...LANDING_IMAGES.electrician, role: 'Elettricista', caption: 'Quadri e impianti' },
  { ...LANDING_IMAGES.wiresCloseup, role: 'Dettaglio lavoro', caption: 'Precisione sul campo' },
  { ...LANDING_IMAGES.hvac, role: 'Climatizzazione', caption: 'Manutenzioni programmate' },
  { ...LANDING_IMAGES.fridgeTech, role: 'Frigorista', caption: 'Horeca e industria' },
  { ...LANDING_IMAGES.carpenter, role: 'Falegname', caption: 'Cantieri e misure' },
  { ...LANDING_IMAGES.team, role: 'Team operativo', caption: 'Fino a 5 operatori' },
];