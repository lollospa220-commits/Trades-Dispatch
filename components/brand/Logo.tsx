import Image from 'next/image';
import { BRAND } from '@/lib/brand';

type LogoProps = {
  /** 'full' = mark + wordmark, 'mark' = solo icona */
  variant?: 'full' | 'mark';
  className?: string;
  /** Mantenuto per compatibilità API; il mark ha sfondo proprio */
  theme?: 'light' | 'dark';
};

export function BrandMark({ className = '' }: { className?: string; theme?: 'light' | 'dark' }) {
  return (
    <Image
      src="/brand/app-icon.png"
      alt=""
      width={1024}
      height={1024}
      className={`shrink-0 object-contain ${className}`}
      aria-hidden
      priority
    />
  );
}

export default function Logo({ variant = 'full', className = '', theme = 'dark' }: LogoProps) {
  const textColor = theme === 'light' ? 'text-white' : 'text-brand-navy';
  const subColor = theme === 'light' ? 'text-white/70' : 'text-brand-muted';

  if (variant === 'mark') {
    return (
      <div className={`inline-flex ${className}`} aria-label={BRAND.name}>
        <BrandMark className="h-9 w-9 sm:h-10 sm:w-10" />
      </div>
    );
  }

  return (
    <div className={`inline-flex min-w-0 items-center gap-2 sm:gap-2.5 ${className}`} aria-label={BRAND.name}>
      <BrandMark className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
      <div className="min-w-0 text-left leading-tight">
        <div className={`truncate font-display text-base font-bold tracking-tight sm:text-lg ${textColor}`}>
          Opifice
        </div>
        <div className={`hidden text-[10px] font-medium uppercase tracking-widest sm:block ${subColor}`}>
          {BRAND.tagline}
        </div>
      </div>
    </div>
  );
}