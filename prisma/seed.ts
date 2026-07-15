import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const DEMO_PASSWORD = 'demo1234';

function todayAtRome(hour: number, minute = 0): Date {
  const romeDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return new Date(`${romeDate}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+02:00`);
}

async function seedCompany(data: {
  slug: string;
  name: string;
  email: string;
  passwordHash: string;
}) {
  return prisma.company.upsert({
    where: { slug: data.slug },
    update: {
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
    },
    create: data,
  });
}

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const idraulica = await seedCompany({
    slug: 'demo-idraulica',
    name: 'Idraulica Rossi S.r.l.',
    email: 'admin@demo-idraulica.it',
    passwordHash,
  });

  const elettrica = await seedCompany({
    slug: 'demo-elettrica',
    name: 'Elettrica Blu S.r.l.',
    email: 'admin@demo-elettrica.it',
    passwordHash,
  });

  const [marco, luca] = await Promise.all([
    prisma.technician.upsert({
      where: { id: 'seed-tech-marco' },
      update: { companyId: idraulica.id },
      create: {
        id: 'seed-tech-marco',
        name: 'Marco Bianchi',
        phone: '+393331112233',
        email: 'marco@demo-idraulica.it',
        companyId: idraulica.id,
      },
    }),
    prisma.technician.upsert({
      where: { id: 'seed-tech-luca' },
      update: { companyId: idraulica.id },
      create: {
        id: 'seed-tech-luca',
        name: 'Luca Verdi',
        phone: '+393334445566',
        email: 'luca@demo-idraulica.it',
        companyId: idraulica.id,
      },
    }),
  ]);

  // Tecnico per la seconda azienda (test multi-tenant)
  await prisma.technician.upsert({
    where: { id: 'seed-tech-anna' },
    update: { companyId: elettrica.id },
    create: {
      id: 'seed-tech-anna',
      name: 'Anna Russo',
      phone: '+393337778899',
      email: 'anna@demo-elettrica.it',
      companyId: elettrica.id,
    },
  });

  const customers = await Promise.all(
    [
      { id: 'seed-customer-0', name: 'Giulia Ferrari', phone: '+393371234567', address: 'Via Roma 12, Milano' },
      { id: 'seed-customer-1', name: 'Paolo Neri', phone: '+393379876543', address: 'Corso Venezia 8, Milano' },
      { id: 'seed-customer-2', name: 'Sara Colombo', phone: '+393335551234', address: 'Viale Monza 45, Milano' },
    ].map((c) =>
      prisma.customer.upsert({
        where: { id: c.id },
        update: { companyId: idraulica.id },
        create: { ...c, companyId: idraulica.id },
      }),
    ),
  );

  const jobs = [
    {
      id: 'seed-job-1',
      title: 'Perdita sotto lavandino',
      scheduledAt: todayAtRome(9, 0),
      customerId: customers[0].id,
      technicianId: marco.id,
      status: 'SCHEDULED' as const,
      companyId: idraulica.id,
    },
    {
      id: 'seed-job-2',
      title: 'Sostituzione caldaia',
      scheduledAt: todayAtRome(11, 30),
      customerId: customers[1].id,
      technicianId: luca.id,
      status: 'IN_PROGRESS' as const,
      companyId: idraulica.id,
    },
    {
      id: 'seed-job-3',
      title: 'Installazione boiler',
      scheduledAt: todayAtRome(15, 0),
      customerId: customers[2].id,
      technicianId: null,
      status: 'SCHEDULED' as const,
      companyId: idraulica.id,
    },
  ];

  for (const j of jobs) {
    await prisma.job.upsert({
      where: { id: j.id },
      update: {
        title: j.title,
        scheduledAt: j.scheduledAt,
        technicianId: j.technicianId,
        status: j.status,
        companyId: j.companyId,
      },
      create: {
        ...j,
        description: 'Intervento demo per dashboard',
        startedAt: j.status === 'IN_PROGRESS' ? new Date() : null,
      },
    });
  }

  console.log('Seed OK');
  console.log('  Idraulica:', idraulica.email, '/', DEMO_PASSWORD);
  console.log('  Elettrica:', elettrica.email, '/', DEMO_PASSWORD);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());