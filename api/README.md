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

## Полная очистка данных приложения

Удаляются пользователи, опросы и голоса, раунды реакций, задания бинго (и QR, и отметки), haptic, токены привязки аккаунтов, записи `FeatureGate` (если не указано иначе). Схема БД и миграции не меняются.

Реализация: функция `wipeApplicationDatabase` в `src/lib/wipe-database.ts`.

```bash
# из папки api, обязательно подтверждение
WIPE_DATABASE_CONFIRM=YES npm run wipe-database
```

Оставить флаги доступа к страницам (`FeatureGate`), чтобы не включать их заново в админке:

```bash
WIPE_DATABASE_CONFIRM=YES WIPE_KEEP_FEATURE_GATES=1 npm run wipe-database
```

После очистки заданий бинго в БД не будет — выполните `npm run seed:bingo` (и при необходимости обновите `BINGO_*_TASK_ID` в `.env`).

Прод (собранный образ `api`):

```bash
docker compose -f docker/docker-compose.prod.yml exec -e WIPE_DATABASE_CONFIRM=YES api sh -c 'cd /app && node dist/scripts/wipe-database.js'
```

Отдельно: `npm run clear-users` — только пользователи и связанные с ними строки (голоса, бинго-отметки, реакции, haptic, токены); **опросы и задания бинго не удаляет**.

## Бинго (задания в БД)

Стабильные id заданий совпадают с переменными `BINGO_*_TASK_ID` в `.env` / `.env.example`.

```bash
# из папки api (нужны POSTGRES_*)
npm run seed:bingo
```

Полный сброс заданий, QR и отметок бинго перед заполнением: `BINGO_SEED_RESET=1 npm run seed:bingo`.

**Новые уникальные id (uuid)** на каждый запуск — чтобы пересоздать бинго и получить свежий блок для `.env`:

```bash
BINGO_SEED_RANDOM_IDS=1 npm run seed:bingo
```

В этом режиме сначала выполняется полная очистка заданий, QR и отметок бинго, затем создаются 9 заданий с новыми uuid. Обязательно скопируйте вывод в `.env` и перезапустите api.

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

С новыми uuid (перегенерация id + сброс бинго):

```bash
docker compose -f docker/docker-compose.prod.yml exec -e BINGO_SEED_RANDOM_IDS=1 api sh -c 'cd /app && node dist/scripts/seed-bingo-tasks.js'
```
