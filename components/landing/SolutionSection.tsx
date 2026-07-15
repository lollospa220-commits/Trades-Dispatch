import { LANDING } from '@/lib/landing';

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

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {solution.steps.map((step, i) => (
            <div key={step.step} className="relative text-center md:text-left">
              {i < solution.steps.length - 1 && (
                <div
                  className="absolute left-1/2 top-8 hidden h-px w-full bg-brand-sand-dark md:block"
                  aria-hidden
                />
              )}
              <div className="relative mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-navy font-display text-xl font-bold text-brand-amber md:mx-0">
                {step.step}
              </div>
              <h3 className="font-display mt-6 text-xl font-bold text-brand-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}