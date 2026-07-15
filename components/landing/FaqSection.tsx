import { LANDING } from '@/lib/landing';
import { whatsappSupportDisplay, whatsappSupportUrl } from '@/lib/support';

export default function FaqSection() {
  const { faq } = LANDING;
  const waUrl = whatsappSupportUrl('Ciao, ho una domanda su Trades Dispatch');
  const waNum = whatsappSupportDisplay();

  return (
    <section id="faq" className="landing-section scroll-mt-20 bg-white">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="font-display text-center text-2xl font-bold text-brand-navy sm:text-3xl">{faq.title}</h2>

        <div className="mt-10 space-y-3">
          {faq.items.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-brand-sand-dark bg-brand-sand/30 px-4 py-3 open:bg-white open:shadow-sm"
            >
              <summary className="cursor-pointer list-none font-display text-sm font-semibold text-brand-navy marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-2">
                  {item.q}
                  <span className="text-brand-muted transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted">{item.a}</p>
            </details>
          ))}
        </div>

        {waUrl && waNum && (
          <p className="mt-8 text-center text-sm text-brand-muted">
            Altro dubbio?{' '}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-teal hover:underline"
            >
              Scrivici su WhatsApp {waNum}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}