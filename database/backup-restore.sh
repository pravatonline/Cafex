#!/usr/bin/env bash
# ==============================================================================
# CAFEX - DATABASE BACKUP, RESTORE & OPTIMIZATION SCRIPT
# Supports Supabase PostgreSQL & Standard Postgres
# ==============================================================================

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/cafex_backup_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

# Connection details from environment variables or defaults
PG_HOST="${DB_HOST:-localhost}"
PG_PORT="${DB_PORT:-5432}"
PG_USER="${DB_USER:-postgres}"
PG_NAME="${DB_NAME:-cafex}"

function backup_database() {
  echo "🚀 Starting Cafex database backup to ${BACKUP_FILE}..."
  PGPASSWORD="${DB_PASSWORD}" pg_dump -h "${PG_HOST}" -p "${PG_PORT}" -U "${PG_USER}" -d "${PG_NAME}" -F p | gzip > "${BACKUP_FILE}"
  echo "✅ Backup successfully created at: ${BACKUP_FILE}"
}

function restore_database() {
  if [ -z "$1" ]; then
    echo "❌ Error: Please specify the backup file to restore."
    echo "Usage: ./backup-restore.sh restore ./backups/cafex_backup_YYYYMMDD_HHMMSS.sql.gz"
    exit 1
  fi

  RESTORE_FILE="$1"
  echo "⚠️ Warning: This will restore from ${RESTORE_FILE} into ${PG_NAME}. Proceed? (y/n)"
  read -r CONFIRM
  if [ "$CONFIRM" = "y" ]; then
    echo "🔄 Restoring database..."
    gunzip -c "${RESTORE_FILE}" | PGPASSWORD="${DB_PASSWORD}" psql -h "${PG_HOST}" -p "${PG_PORT}" -U "${PG_USER}" -d "${PG_NAME}"
    echo "✅ Database restore completed!"
  else
    echo "Restore cancelled."
  fi
}

function optimize_database() {
  echo "⚡ Running vacuum analyze and re-indexing on ${PG_NAME}..."
  PGPASSWORD="${DB_PASSWORD}" psql -h "${PG_HOST}" -p "${PG_PORT}" -U "${PG_USER}" -d "${PG_NAME}" -c "
    VACUUM (ANALYZE, VERBOSE);
    REINDEX DATABASE ${PG_NAME};
  "
  echo "✅ Database optimization and indexing complete!"
}

case "$1" in
  backup)
    backup_database
    ;;
  restore)
    restore_database "$2"
    ;;
  optimize)
    optimize_database
    ;;
  *)
    echo "Cafex Database Utility"
    echo "Usage: $0 {backup|restore <file>|optimize}"
    ;;
esac
