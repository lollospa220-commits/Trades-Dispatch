import { prisma } from '@/lib/prisma';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

export async function uniqueCompanySlug(base: string): Promise<string> {
  const root = slugify(base) || 'account';
  let slug = root;
  let n = 0;

  while (await prisma.company.findUnique({ where: { slug }, select: { id: true } })) {
    n += 1;
    slug = `${root}-${n}`;
  }

  return slug;
}