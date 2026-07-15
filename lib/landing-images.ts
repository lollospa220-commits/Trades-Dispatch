/** Immagini landing — operatori e artigiani tecnici */
export const LANDING_IMAGES = {
  hero: { src: '/landing/hero.jpg', alt: 'Operatore tecnico che esce dal furgone per un intervento' },
  solo: { src: '/landing/solo-operator.jpg', alt: 'Idraulico che consulta la tablet in cantiere' },
  team: { src: '/landing/team-van.jpg', alt: 'Piccolo team di tecnici davanti al furgone aziendale' },
  electrician: { src: '/landing/electrician.jpg', alt: 'Elettricista che ispeziona un quadro elettrico' },
  plumber: { src: '/landing/plumber.jpg', alt: 'Idraulico sotto il lavandino durante un intervento' },
} as const;

export const AUDIENCE_IMAGES = [
  LANDING_IMAGES.solo,
  LANDING_IMAGES.team,
  LANDING_IMAGES.electrician,
] as const;