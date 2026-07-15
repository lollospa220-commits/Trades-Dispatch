import { AccountType, PrismaClient } from '@prisma/client';
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
  accountType?: AccountType;
}) {
  return prisma.company.upsert({
    where: { slug: data.slug },
    update: {
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      accountType: data.accountType ?? 'COMPANY',
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
    accountType: 'COMPANY',
  });

  const elettrica = await seedCompany({
    slug: 'demo-elettrica',
    name: 'Elettrica Blu S.r.l.',
    email: 'admin@demo-elettrica.it',
    passwordHash,
    accountType: 'COMPANY',
  });

  const solo = await seedCompany({
    slug: 'demo-solo-marco',
    name: 'Idraulica Bianchi',
    email: 'marco@demo-solo.it',
    passwordHash,
    accountType: 'SOLO',
  });

  const soloTech = await prisma.technician.upsert({
    where: { id: 'seed-tech-solo-marco' },
    update: { companyId: solo.id },
    create: {
      id: 'seed-tech-solo-marco',
      name: 'Marco Bianchi',
      phone: '+393339998877',
      email: 'marco@demo-solo.it',
      companyId: solo.id,
    },
  });

  const soloCustomer = await prisma.customer.upsert({
    where: { id: 'seed-customer-solo-0' },
    update: { companyId: solo.id },
    create: {
      id: 'seed-customer-solo-0',
      name: 'Laura Martini',
      phone: '+393331112233',
      address: 'Via Garibaldi 5, Milano',
      companyId: solo.id,
    },
  });

  await prisma.job.upsert({
    where: { id: 'seed-job-solo-1' },
    update: {
      companyId: solo.id,
      technicianId: soloTech.id,
      scheduledAt: todayAtRome(10, 0),
    },
    create: {
      id: 'seed-job-solo-1',
      title: 'Riparazione rubinetto',
      description: 'Intervento demo operatore singolo',
      scheduledAt: todayAtRome(10, 0),
      status: 'SCHEDULED',
      companyId: solo.id,
      customerId: soloCustomer.id,
      technicianId: soloTech.id,
    },
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
  console.log('  Azienda idraulica:', idraulica.email, '/', DEMO_PASSWORD);
  console.log('  Azienda elettrica:', elettrica.email, '/', DEMO_PASSWORD);
  console.log('  Operatore singolo:', solo.email, '/', DEMO_PASSWORD);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());