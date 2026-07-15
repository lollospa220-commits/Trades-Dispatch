import { LANDING } from '@/lib/landing';

export default function TestimonialsSection() {
  const { testimonials } = LANDING;

  return (
    <section className="landing-section bg-brand-sand">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-brand-navy sm:text-3xl">{testimonials.title}</h2>
          <p className="mt-2 text-sm text-brand-muted">{testimonials.subtitle}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.items.map((t) => (
            <blockquote
              key={t.name}
              className="brand-card flex flex-col p-5"
            >
              <p className="flex-1 text-sm leading-relaxed text-brand-ink">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 border-t border-brand-sand-dark pt-4">
                <p className="font-display text-sm font-bold text-brand-navy">{t.name}</p>
                <p className="text-xs text-brand-muted">
                  {t.role} · {t.city}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}