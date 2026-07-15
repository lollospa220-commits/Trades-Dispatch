#!/usr/bin/env bash
# Deploy Opifice su Vercel (senza GitHub, da cartella locale)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== Deploy Vercel — Opifice ==="
echo ""
echo "Prima del deploy, in Vercel Dashboard aggiungi queste env vars:"
echo "  DATABASE_URL  (Supabase pooler, porta 6543)"
echo "  DIRECT_URL    (Supabase direct, porta 5432)"
echo "  AUTH_SECRET   (stringa random lunga)"
echo ""

if ! npx vercel whoami &>/dev/null; then
  echo "Login Vercel richiesto..."
  npx vercel login
fi

echo "Deploy in corso..."
npx vercel --prod

echo ""
echo "✓ Deploy completato. Ricorda di eseguire il seed su Supabase:"
echo "  npm run db:seed   (con .env puntato a Supabase)"