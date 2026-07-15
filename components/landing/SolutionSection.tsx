import LandingImage from '@/components/landing/LandingImage';
import { LANDING } from '@/lib/landing';
import { LANDING_IMAGES } from '@/lib/landing-images';

export default function SolutionSection() {
  const { solution } = LANDING;

  return (
    <section className="border-y border-brand-sand-dark bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
            {solution.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-muted">{solution.subtitle}</p>
        </div>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl ring-1 ring-brand-sand-dark">
              <LandingImage
                src={LANDING_IMAGES.blueprint.src}
                alt={LANDING_IMAGES.blueprint.alt}
                sizes="(max-width: 1024px) 100vw, 400px"
              />
            </div>
            <div className="absolute -bottom-4 left-4 right-4 rounded-xl bg-brand-teal-light px-4 py-3 text-center text-sm font-semibold text-brand-teal shadow-md ring-1 ring-brand-teal/20">
              SMS inviato · Cliente avvisato
            </div>
          </div>

          <div className="space-y-6 lg:col-span-3">
            {solution.steps.map((step) => (
              <div
                key={step.step}
                className="flex gap-5 rounded-2xl border border-brand-sand-dark bg-brand-sand/50 p-5 transition hover:border-brand-blue/30 hover:bg-white hover:shadow-sm"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-navy font-display text-lg font-bold text-brand-amber">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-brand-navy">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}