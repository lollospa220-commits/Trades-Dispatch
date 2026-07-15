-- Opifice — schema iniziale (idempotente).
-- Esegui in Supabase → SQL Editor, oppure: npx prisma migrate deploy

-- ── Enum ─────────────────────────────────────────────────────────────────────

do $$ begin
  create type "JobStatus" as enum ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED');
exception
  when duplicate_object then null;
end $$;

-- ── Tabelle ──────────────────────────────────────────────────────────────────

create table if not exists public.companies (
  id            text primary key,
  name          text not null,
  slug          text not null,
  email         text not null,
  password_hash text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint companies_slug_unique unique (slug),
  constraint companies_email_unique unique (email)
);

create table if not exists public.technicians (
  id         text primary key,
  name       text not null,
  email      text,
  phone      text,
  active     boolean not null default true,
  company_id text not null references public.companies (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists technicians_company_id_idx on public.technicians (company_id);

create table if not exists public.customers (
  id         text primary key,
  name       text not null,
  phone      text,
  email      text,
  address    text,
  company_id text not null references public.companies (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customers_company_id_idx on public.customers (company_id);

create table if not exists public.jobs (
  id            text primary key,
  title         text not null,
  description   text,
  status        "JobStatus" not null default 'SCHEDULED',
  scheduled_at  timestamptz not null,
  started_at    timestamptz,
  completed_at  timestamptz,
  company_id    text not null references public.companies (id) on delete cascade,
  customer_id   text not null references public.customers (id) on delete restrict,
  technician_id text references public.technicians (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists jobs_company_id_scheduled_at_idx on public.jobs (company_id, scheduled_at);
create index if not exists jobs_technician_id_idx on public.jobs (technician_id);