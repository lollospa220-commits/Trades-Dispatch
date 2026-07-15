import Logo from '@/components/brand/Logo';
import DashboardNav from '@/components/dashboard/DashboardNav';
import LogoutButton from '@/components/dashboard/LogoutButton';

type Props = {
  companyName: string;
  email: string;
  accountLabel: string;
  dateLabel: string;
  dateLabelShort: string;
  jobCount: number;
  isSolo: boolean;
};

export default function DashboardHeader({
  companyName,
  email,
  accountLabel,
  dateLabel,
  dateLabelShort,
  jobCount,
  isSolo,
}: Props) {
  return (
    <header className="border-b border-brand-sand-dark bg-brand-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-5">
            {/* Wrapper per la visibilità: il Logo ha display proprio che vince su `hidden` */}
            <span className="shrink-0 sm:hidden">
              <Logo theme="light" variant="mark" />
            </span>
            <span className="hidden shrink-0 sm:block">
              <Logo theme="light" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-display text-base font-semibold sm:text-lg">{companyName}</h1>
              <p className="truncate text-xs text-white/60">
                <span className="sm:hidden">{accountLabel}</span>
                <span className="hidden sm:inline">
                  {email} · {accountLabel}
                </span>
              </p>
              <p className="truncate text-xs text-white/45 sm:hidden">{email}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="text-right text-sm text-white/70">
              <p className="hidden font-medium capitalize text-white sm:block">{dateLabel}</p>
              <p className="font-medium capitalize text-white sm:hidden">{dateLabelShort}</p>
              <p className="text-xs sm:text-sm">
                {jobCount} intervent{jobCount === 1 ? 'o' : 'i'}
              </p>
            </div>
            <LogoutButton theme="light" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl">
        <DashboardNav isSolo={isSolo} />
      </div>
    </header>
  );
}