# Docker

Окружение для запуска всех сервисов (frontend, api, ws) через nginx. Dev — с горячей перезагрузкой и HTTPS; prod — сборка образов и раздача статики.

## Файлы

| Файл | Назначение |
|------|------------|
| **docker-compose.dev.yml** | Разработка: app (Vite), api, ws, nginx. Порты 80, 443, 5173, 3000, 3001. |
| **docker-compose.prod.yml** | Production: образы api, ws, web (frontend + nginx). Наружу только порт 80. |
| **nginx/nginx.dev.conf.template** | Шаблон nginx для dev: прокси на Vite, `/api/`, `/ws`, SSL из `nginx/ssl/`. |
| **nginx/nginx.prod.conf** | Конфиг nginx для prod: статика из образа web + прокси `/api/`, `/ws`. |
| **nginx/ssl/** | Сертификаты для HTTPS в dev. Генерация: `./scripts/gen-ssl.sh` (из корня). |

Образы api и ws собираются из своих папок. Образ web (frontend) — из корня репозитория (context `.`), чтобы использовать `docker/nginx/nginx.prod.conf`.

## Запуск

Команды выполняются **из корня репозитория**:

```bash
# Разработка (все сервисы + nginx)
docker compose -f docker/docker-compose.dev.yml up --build

# Production (фоновый режим)
docker compose -f docker/docker-compose.prod.yml up --build -d
```

## Dev

- **app** — frontend (Vite), context `frontend/`, `Dockerfile.dev`, монтируется `../frontend`.
- **api**, **ws** — контексты `api/`, `ws/`, свои `Dockerfile.dev`.
- **nginx** — подставляет `DOMAIN` из `.env` в шаблон, слушает 80 (редирект на HTTPS) и 443.
- Сеть **app**: все сервисы в одной сети, nginx проксирует `/api/` → api:3000, `/ws` → ws:3001.

Перед первым запуском: задать `DOMAIN` в `.env`, при необходимости выполнить `./scripts/gen-ssl.sh` и добавить запись в `/etc/hosts`.

## Prod

- **api**, **ws** — образы из `api/Dockerfile`, `ws/Dockerfile`.
- **web** — образ из `frontend/Dockerfile` (сборка frontend + nginx со статикой и прокси).
- Сеть **app**: только внутренние порты, наружу открыт 80 (контейнер web).

## SSL (dev)

Сертификаты лежат в `docker/nginx/ssl/` (файлы в `.gitignore`). Скрипт `./scripts/gen-ssl.sh` читает `DOMAIN` из `.env` и генерирует `cert.pem`, `key.pem`. Подробнее — в `nginx/ssl/README.md`.
