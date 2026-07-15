import { LANDING } from '@/lib/landing';
import Link from 'next/link';

export default function FinalCtaSection() {
  const { finalCta } = LANDING;

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
          {finalCta.title}
        </h2>
        <p className="mt-4 text-lg text-brand-muted">{finalCta.subtitle}</p>
        <Link
          href="/register"
          className="brand-btn-primary mt-10 inline-block rounded-xl px-8 py-4 text-base"
        >
          {finalCta.cta}
        </Link>
      </div>
    </section>
  );
}