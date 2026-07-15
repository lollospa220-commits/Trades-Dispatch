-- Opifice — tipo account (azienda vs operatore singolo)

do $$ begin
  create type "AccountType" as enum ('COMPANY', 'SOLO');
exception
  when duplicate_object then null;
end $$;

alter table public.companies
  add column if not exists account_type "AccountType" not null default 'COMPANY';