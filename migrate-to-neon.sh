#!/bin/bash
# Migração do banco Render → Neon
# Uso: ./migrate-to-neon.sh

set -e

echo "=== Migração Render → Neon ==="

# Conexão origem (Render)
RENDER_URL="${RENDER_DATABASE_URL}"

# Conexão destino (Neon)
NEON_URL="${NEON_DATABASE_URL}"

if [ -z "$RENDER_URL" ] || [ -z "$NEON_URL" ]; then
  echo "Defina as variáveis de ambiente antes de rodar:"
  echo "  export RENDER_DATABASE_URL='postgresql://usuario:senha@host-render/dbname'"
  echo "  export NEON_DATABASE_URL='postgresql://usuario:senha@ep-xxx.neon.tech/neondb?sslmode=require'"
  exit 1
fi

echo "[1/3] Exportando dados do Render..."
pg_dump "$RENDER_URL" -F c -f backup_render.dump
echo "      backup_render.dump criado."

echo "[2/3] Importando no Neon..."
pg_restore --no-owner --no-privileges -d "$NEON_URL" -F c backup_render.dump
echo "      Importação concluída."

echo "[3/3] Removendo arquivo temporário..."
rm backup_render.dump

echo ""
echo "=== Migração concluída com sucesso! ==="
