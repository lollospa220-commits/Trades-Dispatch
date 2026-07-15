import LandingImage from '@/components/landing/LandingImage';
import { GALLERY_ITEMS } from '@/lib/landing-images';

export default function OperatorsGallery() {
  return (
    <section className="border-y border-brand-sand-dark bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-brand-muted">
          Chi usa Trades Dispatch
        </p>
        <h2 className="font-display mt-3 text-center text-2xl font-bold text-brand-navy sm:text-3xl">
          Operatori veri. Problemi veri. Soluzione semplice.
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {GALLERY_ITEMS.map((item) => (
            <figure
              key={item.src}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-md ring-1 ring-brand-sand-dark"
            >
              <LandingImage
                src={item.src}
                alt={item.alt}
                sizes="(max-width: 640px) 50vw, 25vw"
                className="transition duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/60 to-transparent px-3 pb-3 pt-12">
                <p className="font-display text-sm font-bold text-white">{item.role}</p>
                <p className="text-xs text-white/65">{item.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}