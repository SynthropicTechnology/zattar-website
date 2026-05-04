#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# cloudron/deploy.sh — Deploy para Cloudron (my.sinesys.online)
#
# Uso:
#   ./cloudron/deploy.sh           # primeiro deploy (cloudron install)
#   ./cloudron/deploy.sh --update  # atualização    (cloudron update)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Infraestrutura ────────────────────────────────────────────────────────────
CLOUDRON_SERVER="my.sinesys.online"
REPOSITORY="registry.sinesys.online/zattar-website"
LOCATION="zattaradvogados.com"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# ── Build-time (baked no JS bundle do cliente) ───────────────────────────────
NEXT_PUBLIC_SUPABASE_URL="https://cxxdivtgeslrujpfpivs.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY="sb_publishable_c2-ICRd-M-68oCRJNNDEVw_uMnxGgD_"
NEXT_PUBLIC_WEBSITE_URL="https://zattaradvogados.com"

# ── Runtime (lidos pelo servidor Node.js) ─────────────────────────────────────
SUPABASE_SECRET_KEY="sb_secret_5IOk8AZQTxNs99VFDVvTIg_q7I9iY6F"
STRAPI_URL="https://strapi.sinesys.online"
STRAPI_API_TOKEN="e57f022e05807852bdb807b25ff6c9c08b8d122161a773a569cd0cb9e0680c43d0446382aa4c0791bd19cdc168e1996636b49fb2e0012ea5f0ac6cc4259e4d6167e017f254aec3cd4ba9adbc599622e29d248e4555e40a03951a784fe03a8c1c72af44c3f58eb20016c2d8cdbb9b8d68e63126ff0e048d606a0e47c8833b87b7"
CSP_REPORT_ONLY="false"
ENABLE_REDIS_CACHE="false"

MODE="${1:---first}"

echo "▶  Projeto : ${PROJECT_DIR}"
echo "▶  Registry: ${REPOSITORY}"
echo "▶  Destino : ${LOCATION} (${CLOUDRON_SERVER})"
echo ""

# ── 1. Build remoto ───────────────────────────────────────────────────────────
cd "${PROJECT_DIR}"

cloudron build build \
  --repository "${REPOSITORY}" \
  --build-arg "NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}" \
  --build-arg "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY}" \
  --build-arg "NEXT_PUBLIC_WEBSITE_URL=${NEXT_PUBLIC_WEBSITE_URL}" \
  --build-arg "SKIP_TYPE_CHECK=true"

# ── 2. Obtém tag da imagem recém-construída ───────────────────────────────────
DOCKER_IMAGE=$(jq -r ".apps[\"${PROJECT_DIR}\"].dockerImage" ~/.cloudron.json)
echo ""
echo "▶  Imagem  : ${DOCKER_IMAGE}"
echo ""

# ── 3. Deploy ─────────────────────────────────────────────────────────────────
if [[ "${MODE}" == "--first" ]]; then
  echo "▶  Primeiro deploy..."
  cloudron --server "${CLOUDRON_SERVER}" install \
    --image "${DOCKER_IMAGE}" \
    --location "${LOCATION}" \
    --env "SUPABASE_SECRET_KEY=${SUPABASE_SECRET_KEY}" \
    --env "STRAPI_URL=${STRAPI_URL}" \
    --env "STRAPI_API_TOKEN=${STRAPI_API_TOKEN}" \
    --env "CSP_REPORT_ONLY=${CSP_REPORT_ONLY}" \
    --env "ENABLE_REDIS_CACHE=${ENABLE_REDIS_CACHE}"
else
  echo "▶  Atualizando..."
  cloudron --server "${CLOUDRON_SERVER}" update \
    --image "${DOCKER_IMAGE}" \
    --app "${LOCATION}"
fi

echo ""
echo "✓  Deploy concluído → https://${LOCATION}"
