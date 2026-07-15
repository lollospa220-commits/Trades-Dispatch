-- Secondo livello di sicurezza (opzionale): abilita RLS su Supabase
-- L'app usa service role via Prisma; per accesso diretto da client abilitare policy per company_id.

-- ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;