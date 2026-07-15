#!/usr/bin/env bash
# Setup Supabase per Opifice
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== Opifice → Supabase ==="
echo ""
echo "1. Crea un progetto su https://supabase.com/dashboard"
echo "2. Vai in Project Settings → Database → Connection string"
echo "3. Copia .env.example in .env e incolla:"
echo "   - DATABASE_URL (Transaction pooler, porta 6543, ?pgbouncer=true)"
echo "   - DIRECT_URL   (Direct connection, porta 5432)"
echo "4. Genera AUTH_SECRET: openssl rand -base64 32"
echo ""

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Creato .env da .env.example — compila le credenziali Supabase."
  exit 0
fi

if grep -q '\[PROJECT_REF\]' .env 2>/dev/null; then
  echo "⚠️  .env contiene ancora placeholder. Inserisci le credenziali Supabase."
  exit 1
fi

echo "Applico schema al database..."
npm run db:migrate

echo "Popolo dati demo..."
npm run db:seed

echo ""
echo "✓ Supabase pronto. Avvia: npm run dev"
echo "  Login demo: admin@demo-idraulica.it / demo1234"