import Link from 'next/link';

export default function OnboardingBanner({
  hasCustomers,
  hasTechnicians,
  isSolo,
}: {
  hasCustomers: boolean;
  hasTechnicians: boolean;
  isSolo: boolean;
}) {
  const steps = [
    !hasCustomers && { label: 'Aggiungi il primo cliente', href: '/dashboard/customers' },
    !isSolo && !hasTechnicians && { label: 'Aggiungi un tecnico', href: '/dashboard/technicians' },
  ].filter(Boolean) as { label: string; href: string }[];

  if (steps.length === 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-brand-blue/25 bg-brand-blue/5 p-4">
      <p className="font-display text-sm font-semibold text-brand-navy">Primi passi</p>
      <ul className="mt-2 space-y-1">
        {steps.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="text-sm font-medium text-brand-blue hover:underline">
              → {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}