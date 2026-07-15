/** Converte date (YYYY-MM-DD) + time (HH:mm) in Date interpretata come Europe/Rome. */
export function parseScheduleRome(date: string, time: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
  const d = new Date(`${date}T${time}:00+02:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}