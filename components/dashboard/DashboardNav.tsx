'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/dashboard', label: 'Agenda', match: (p: string) => p === '/dashboard' },
  { href: '/dashboard/invoices', label: 'Fatture', match: (p: string) => p.startsWith('/dashboard/invoices') },
  { href: '/dashboard/customers', label: 'Clienti', match: (p: string) => p.startsWith('/dashboard/customers') },
  { href: '/dashboard/technicians', label: 'Tecnici', match: (p: string) => p.startsWith('/dashboard/technicians') },
  { href: '/dashboard/settings', label: 'Impostazioni', match: (p: string) => p.startsWith('/dashboard/settings') },
];

export default function DashboardNav({ isSolo }: { isSolo: boolean }) {
  const pathname = usePathname();
  const links = isSolo ? LINKS.filter((l) => l.href !== '/dashboard/technicians') : LINKS;

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-white/10 px-4 pb-0 scrollbar-none sm:gap-2">
      {links.map((link) => {
        const active = link.match(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition ${
              active
                ? 'border-brand-amber text-white'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}