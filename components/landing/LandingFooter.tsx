import Logo from '@/components/brand/Logo';
import { BRAND } from '@/lib/brand';
import { whatsappSupportDisplay, whatsappSupportUrl } from '@/lib/support';
import Link from 'next/link';

export default function LandingFooter() {
  const waUrl = whatsappSupportUrl('Ciao, vorrei informazioni su Opifice');
  const waNum = whatsappSupportDisplay();

  return (
    <footer className="border-t border-brand-sand-dark bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 safe-bottom sm:flex-row sm:items-start sm:justify-between sm:py-10">
        <div>
          <Logo />
          <p className="mt-2 max-w-xs text-sm text-brand-muted">{BRAND.tagline}</p>
          {waUrl && waNum && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#25D366]/10 px-3 py-2 text-sm font-semibold text-[#128C7E] transition hover:bg-[#25D366]/20"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-[10px] font-bold text-white">
                WA
              </span>
              Scrivici su WhatsApp · {waNum}
            </a>
          )}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/register" className="font-semibold text-brand-blue hover:text-brand-blue-dark">
            Registrati
          </Link>
          <Link href="/login" className="text-brand-muted hover:text-brand-ink">
            Accedi
          </Link>
          <a href="#prodotto" className="text-brand-muted hover:text-brand-ink">
            Prodotto
          </a>
          <a href="#prezzi" className="text-brand-muted hover:text-brand-ink">
            Prezzi
          </a>
          <a href="#faq" className="text-brand-muted hover:text-brand-ink">
            FAQ
          </a>
          <Link href="/privacy" className="text-brand-muted hover:text-brand-ink">
            Privacy
          </Link>
          <Link href="/termini" className="text-brand-muted hover:text-brand-ink">
            Termini
          </Link>
        </div>
      </div>
      <div className="border-t border-brand-sand-dark px-4 py-4 text-center text-xs text-brand-muted">
        © {new Date().getFullYear()} {BRAND.name}. Gestionale per artigiani tecnici.
      </div>
    </footer>
  );
}