import { BRAND } from '@/lib/brand';

type LogoProps = {
  /** 'full' = mark + wordmark, 'mark' = solo icona */
  variant?: 'full' | 'mark';
  className?: string;
  /** 'light' su sfondo scuro, 'dark' su sfondo chiaro */
  theme?: 'light' | 'dark';
};

/** Logo vettoriale TD: badge dispatch (freccia rotta) + accento campo (amber). */
export function BrandMark({ className, theme = 'dark' }: { className?: string; theme?: 'light' | 'dark' }) {
  const navy = theme === 'light' ? '#FFFFFF' : '#0F1C2E';
  const blue = theme === 'light' ? '#FFFFFF' : '#1E4D8C';
  const amber = '#E87B35';

  return (
    <svg
      viewBox="0 0 40 40"
      width="40"
      height="40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '2.5rem', height: '2.5rem', flexShrink: 0 }}
      aria-hidden
    >
      <rect x="2" y="2" width="36" height="36" rx="10" fill={navy} />
      <path
        d="M11 26 L19 18 L24 23 L29 13"
        stroke={amber}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="29" cy="13" r="2.5" fill={amber} />
      <path
        d="M11 26 L11 30 L15 30"
        stroke={blue}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={theme === 'light' ? 0.9 : 1}
      />
      <path
        d="M24 23 L29 28 L29 13"
        stroke={theme === 'light' ? '#FFFFFF' : '#FFFFFF'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />
    </svg>
  );
}

export default function Logo({ variant = 'full', className = '', theme = 'dark' }: LogoProps) {
  const textColor = theme === 'light' ? 'text-white' : 'text-brand-navy';
  const subColor = theme === 'light' ? 'text-white/70' : 'text-brand-muted';

  if (variant === 'mark') {
    return (
      <div className={`inline-flex ${className}`} aria-label={BRAND.name}>
        <BrandMark className="h-9 w-9" theme={theme} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`} aria-label={BRAND.name}>
      <BrandMark className="h-10 w-10 shrink-0" theme={theme} />
      <div className="text-left leading-tight">
        <div className={`font-display text-lg font-bold tracking-tight ${textColor}`}>
          Trades<span className="text-brand-amber"> Dispatch</span>
        </div>
        <div className={`text-[10px] font-medium uppercase tracking-widest ${subColor}`}>
          {BRAND.tagline}
        </div>
      </div>
    </div>
  );
}