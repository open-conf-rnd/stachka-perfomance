# API (REST)

Сервис REST API на Fastify (TypeScript).

- **Порт:** `API_PORT` (по умолчанию 3000)
- **Эндпоинты:** `GET /health`, `GET /ready`

## Запуск

```bash
# из корня репозитория
npm run dev:api

# или из папки api
npm run dev
```

## Smoke tests

```bash
# разовый прогон (локально/CI)
npm run test:smoke

# watch-режим для локальной разработки
npm run test:smoke:watch
```

Примечания:
- тесты используют `POSTGRES_*` из `.env` (по умолчанию stachka/stachka@localhost:5432/stachka);
- таймеры reaction в smoke принудительно обнулены через env, чтобы тесты выполнялись быстро и стабильно.

## База данных и миграции

- При запуске через **Docker** миграции применяются автоматически перед стартом приложения (`prisma migrate deploy`).
- Локально или если таблицы ещё не созданы, выполните из папки `api`:
  ```bash
  npx prisma migrate deploy
  ```
  (используются `POSTGRES_*` из `.env`)
- Проверить статус миграций: `npx prisma migrate status`

## Бинго (задания в БД)

Стабильные id заданий совпадают с переменными `BINGO_*_TASK_ID` в `.env` / `.env.example`.

```bash
# из папки api (нужны POSTGRES_*)
npm run seed:bingo
```

Полный сброс заданий, QR и отметок бинго перед заполнением: `BINGO_SEED_RESET=1 npm run seed:bingo`.

### Прод (Docker Compose)

После деплоя, из корня репозитория (подставьте свой путь к compose-файлу):

```bash
docker compose -f docker/docker-compose.prod.yml exec api sh -c 'cd /app && node dist/scripts/seed-bingo-tasks.js'
```

Скрипт допишет задания в БД и выведет в консоль готовый блок `BINGO_*_TASK_ID=...` — его можно вставить в `.env` / `.env.prod` и перезапустить `api` (и при необходимости остальные сервисы), если на проде id должны отличаться от значений по умолчанию.

С полным сбросом бинго перед заливкой:

```bash
docker compose -f docker/docker-compose.prod.yml exec -e BINGO_SEED_RESET=1 api sh -c 'cd /app && node dist/scripts/seed-bingo-tasks.js'
```
