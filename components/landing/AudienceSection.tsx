import LandingImage from '@/components/landing/LandingImage';
import { LANDING } from '@/lib/landing';
import { AUDIENCE_IMAGES } from '@/lib/landing-images';

export default function AudienceSection() {
  const { audience } = LANDING;

  return (
    <section className="landing-section bg-brand-navy text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold sm:text-3xl lg:text-4xl">{audience.title}</h2>
          <p className="mt-4 text-lg text-white/65">{audience.subtitle}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 md:grid-cols-3">
          {audience.segments.map((seg, i) => (
            <article
              key={seg.title}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <div className="relative aspect-[16/10]">
                <LandingImage
                  src={AUDIENCE_IMAGES[i].src}
                  alt={AUDIENCE_IMAGES[i].alt}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/20 to-transparent" />
                <h3 className="font-display absolute bottom-4 left-4 text-lg font-bold text-brand-amber">
                  {seg.title}
                </h3>
              </div>
              <p className="p-5 text-sm leading-relaxed text-white/70">{seg.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}