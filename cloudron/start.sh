#!/bin/bash
set -eu

# ─────────────────────────────────────────────────────────────────────────────
# Cloudron start.sh — Zattar Advogados Website
# ─────────────────────────────────────────────────────────────────────────────

export NODE_ENV=production
export PORT=3000
export HOSTNAME="0.0.0.0"

# ── URL canônica ─────────────────────────────────────────────────────────────
# Cloudron injeta CLOUDRON_APP_ORIGIN (ex: https://zattaradvogados.com).
# Afeta apenas código server-side que lê process.env em runtime.
if [[ -n "${CLOUDRON_APP_ORIGIN:-}" ]] && [[ -z "${NEXT_PUBLIC_WEBSITE_URL:-}" ]]; then
  export NEXT_PUBLIC_WEBSITE_URL="${CLOUDRON_APP_ORIGIN}"
fi

# ── Supabase — normaliza nome da chave ───────────────────────────────────────
# O código aceita ambos os nomes (db-client.ts faz fallback SUPABASE_SECRET_KEY)
if [[ -n "${SUPABASE_SECRET_KEY:-}" ]] && [[ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
  export SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SECRET_KEY}"
fi

# ── Iniciar aplicação ────────────────────────────────────────────────────────
exec node /app/server.js
