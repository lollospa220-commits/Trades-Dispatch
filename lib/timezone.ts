const ROME = 'Europe/Rome';

/** Converte data+ora locale Roma in istante UTC corretto (gestisce DST). */
export function romeLocalToUtc(date: string, time: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;

  const [y, mo, d] = date.split('-').map(Number);
  const [h, mi] = time.split(':').map(Number);

  let utc = Date.UTC(y, mo - 1, d, h, mi, 0);

  for (let i = 0; i < 6; i++) {
    const parts = romeParts(new Date(utc));
    const diffMs =
      ((h - parts.hour) * 60 + (mi - parts.minute)) * 60_000 +
      (d - parts.day) * 86_400_000;

    if (parts.year === y && parts.month === mo && parts.day === d && parts.hour === h && parts.minute === mi) {
      return new Date(utc);
    }
    utc -= diffMs;
  }

  return new Date(utc);
}

function romeParts(instant: Date) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: ROME,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const map = Object.fromEntries(fmt.formatToParts(instant).map((p) => [p.type, p.value]));
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
  };
}

export function romeDateString(instant = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ROME,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant);
}

/** Inizio/fine giornata locale Roma. */
export function dayRangeInRome(dateStr: string): { start: Date; end: Date } {
  const start = romeLocalToUtc(dateStr, '00:00');
  const end = romeLocalToUtc(dateStr, '23:59');
  if (!start || !end) throw new Error('Data non valida');
  return { start, end: new Date(end.getTime() + 59_999) };
}

export function todayRangeInRome(): { start: Date; end: Date } {
  return dayRangeInRome(romeDateString());
}

/** Lunedì–domenica della settimana che contiene `anchor`. */
export function weekRangeInRome(anchor = new Date()): { start: Date; end: Date; days: string[] } {
  const anchorStr = romeDateString(anchor);
  const probe = romeLocalToUtc(anchorStr, '12:00')!;
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone: ROME, weekday: 'short' }).format(probe);
  const offsets: Record<string, number> = {
    Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6,
    lun: 0, mar: 1, mer: 2, gio: 3, ven: 4, sab: 5, dom: 6,
  };
  const offset = offsets[weekday] ?? offsets[weekday.toLowerCase()] ?? 0;

  const monday = new Date(probe.getTime() - offset * 86_400_000);
  const mondayStr = romeDateString(monday);
  const mondayStart = dayRangeInRome(mondayStr).start;

  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(romeDateString(new Date(mondayStart.getTime() + i * 86_400_000)));
  }

  const sundayEnd = dayRangeInRome(days[6]).end;
  return { start: mondayStart, end: sundayEnd, days };
}

export function formatTimeRome(iso: string | Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    timeZone: ROME,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function romeTimeString(instant: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: ROME,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(instant);
}

export function formatDateRome(iso: string | Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    timeZone: ROME,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso));
}