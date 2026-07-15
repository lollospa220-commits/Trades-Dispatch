/** Inizio e fine del giorno locale (Europe/Rome) per filtrare gli interventi "di oggi". */
export function todayRangeInRome(): { start: Date; end: Date } {
  const now = new Date();
  const romeDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

  const start = new Date(`${romeDate}T00:00:00+02:00`);
  const end = new Date(`${romeDate}T23:59:59.999+02:00`);
  return { start, end };
}

export function formatTimeRome(iso: string | Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    timeZone: 'Europe/Rome',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}