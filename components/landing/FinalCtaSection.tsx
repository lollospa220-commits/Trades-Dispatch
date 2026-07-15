import LandingImage from '@/components/landing/LandingImage';
import { LANDING } from '@/lib/landing';
import { LANDING_IMAGES } from '@/lib/landing-images';
import Link from 'next/link';

export default function FinalCtaSection() {
  const { finalCta } = LANDING;

  return (
    <section className="landing-section relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:gap-12 lg:grid-cols-2">
        <div className="relative order-2 aspect-[16/11] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-brand-sand-dark lg:order-1">
          <LandingImage
            src={LANDING_IMAGES.dispatchStreet.src}
            alt={LANDING_IMAGES.dispatchStreet.alt}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/30 to-transparent" />
        </div>

        <div className="order-1 text-center lg:order-2 lg:text-left">
          <h2 className="font-display text-2xl font-bold text-brand-navy sm:text-3xl lg:text-4xl">
            {finalCta.title}
          </h2>
          <p className="mt-4 text-lg text-brand-muted">{finalCta.subtitle}</p>
          <Link
            href="/register"
            className="brand-btn-primary mt-8 w-full rounded-xl px-8 py-4 text-base sm:mt-10 sm:w-auto"
          >
            {finalCta.cta}
          </Link>
          <p className="mt-4 text-sm text-brand-muted">Nessuna carta richiesta per iniziare.</p>
        </div>
      </div>
    </section>
  );
}