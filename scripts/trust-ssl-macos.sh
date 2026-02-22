#!/usr/bin/env bash
# Добавляет самоподписанный сертификат в ключницу macOS.
# Чтобы Chrome показывал замочек для https://udwgrosh.local, доверие нужно выставить вручную (см. ниже).
#
# Запуск: ./scripts/trust-ssl-macos.sh
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CERT="$SCRIPT_DIR/../docker/nginx/ssl/cert.pem"
if [ ! -f "$CERT" ]; then
  echo "Сначала создайте сертификат: ./scripts/gen-ssl.sh"
  exit 1
fi

# Добавляем в системную ключницу (пароль администратора macOS)
echo "Добавляю сертификат в системную ключницу..."
if sudo security add-certificate -k /Library/Keychains/System.keychain "$CERT" 2>/dev/null; then
  echo "Сертификат добавлен."
elif sudo security add-certificate -k /Library/Keychains/System.keychain-db "$CERT" 2>/dev/null; then
  echo "Сертификат добавлен."
else
  OUT=$(sudo security add-certificate -k /Library/Keychains/System.keychain "$CERT" 2>&1) || true
  if echo "$OUT" | grep -q "already in"; then
    echo "Сертификат уже в ключнице."
  else
    echo "$OUT"
  fi
fi

echo ""
echo "Чтобы Chrome показывал замочек, выставите доверие вручную:"
echo "  1. Откройте «Связка ключей» (Keychain Access)."
echo "  2. Слева выберите «Система» (System)."
echo "  3. В поиске введите: udwgrosh.local"
echo "  4. Дважды нажмите на найденный сертификат."
echo "  5. Раскройте «Доверие» (Trust), для «При использовании этого сертификата» выберите «Всегда доверять»."
echo "  6. Закройте окно и введите пароль, если попросит."
echo "  7. Полностью закройте Chrome и откройте снова, зайдите на https://udwgrosh.local"
echo ""
