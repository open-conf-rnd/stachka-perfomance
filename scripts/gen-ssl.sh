#!/usr/bin/env bash
# Генерация самоподписанного SSL для домена из .env (nginx, Telegram Mini App)
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/.."
SSL_DIR="$PROJECT_DIR/docker/nginx/ssl"
ENV_FILE="$PROJECT_DIR/.env"

if [ -f "$ENV_FILE" ]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

DOMAIN="${1:-${DOMAIN:-localhost}}"
mkdir -p "$SSL_DIR"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$SSL_DIR/key.pem" \
  -out "$SSL_DIR/cert.pem" \
  -subj "/CN=$DOMAIN" \
  -addext "subjectAltName=DNS:$DOMAIN"

echo "SSL сертификаты созданы в $SSL_DIR для домена: $DOMAIN"
