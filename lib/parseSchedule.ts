import { romeLocalToUtc } from '@/lib/timezone';

/** Converte date (YYYY-MM-DD) + time (HH:mm) in Date interpretata come Europe/Rome. */
export function parseScheduleRome(date: string, time: string): Date | null {
  return romeLocalToUtc(date, time);
}