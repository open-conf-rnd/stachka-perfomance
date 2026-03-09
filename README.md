# Stachka Performance

Монорепозиторий: **frontend** (TG Mini App), **api** (REST), **ws** (WebSocket статистики). Сервисы независимы — у каждого свой Dockerfile в своей папке.

## Как сервисы связаны

```
                    ┌─────────────┐
                    │   nginx     │  :80 / :443 (в Docker)
                    │  (вход)     │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
   ┌───────────┐    ┌───────────┐    ┌───────────┐
   │ frontend  │    │   /api/   │    │   /ws/    │
   │ (статика) │    │  → api    │    │  → ws     │
   │   :5173   │    │   :3000   │    │   :3001   │
   └───────────┘    └───────────┘    └───────────┘
```

- **Пользователь** заходит на один адрес (домен или localhost). Nginx отдаёт статику frontend и проксирует запросы:
  - **`/api/*`** → сервис **api** (REST: `/health`, `/ready` и др.)
  - **`/ws/*`** → сервис **ws** (WebSocket: подписка на опросы, голоса, рассылка статистики)
- **Frontend** (Mini App) ходит на тот же домен: страницы с `/`, API с `/api/...`, WebSocket с `/ws` (например `wss://<домен>/ws`).

Без Docker frontend, api и ws можно запускать по отдельности на своих портах; тогда frontend нужно настроить на `http://localhost:3000` и `ws://localhost:3001`.

## Сервисы

| Сервис      | Описание                                                                 | Порт  |
|-------------|--------------------------------------------------------------------------|-------|
| **frontend** | TG Mini App (React, Vite). Статика или dev-сервер.                       | 5173  |
| **api**      | REST (Fastify): `/health`, `/ready`.                                     | 3000  |
| **ws**       | WebSocket: подписка на опрос, голос, рассылка `stats`.                    | 3001  |

## Как запускать

Все команды — **из корня репозитория**.

### 1. Локально (без Docker)

Каждый сервис — в своём терминале:

```bash
npm run dev:frontend # frontend → http://localhost:5173
npm run dev:api      # api      → http://localhost:3000
npm run dev:ws       # ws       → ws://localhost:3001
```

Frontend при этом должен знать адреса api и ws (например через env при сборке или в коде).

### 2. Docker — разработка (dev)

Все сервисы + nginx в одной сети; nginx — вход по HTTPS (порт 443) или HTTP (80). Статика и прокси `/api/`, `/ws/` уже настроены.

```bash
docker compose -f docker/docker-compose.dev.yml up --build
```

- Приложение: **https://&lt;DOMAIN&gt;** (из `.env`) или **http://localhost:80**
- Frontend (Vite): **http://localhost:5173**
- API: **http://localhost:3000**, через nginx — **https://&lt;DOMAIN&gt;/api/**
- WS: **ws://localhost:3001**, через nginx — **wss://&lt;DOMAIN&gt;/ws/**

Перед первым запуском: задать `DOMAIN` в `.env`, при необходимости сгенерировать SSL (`./scripts/gen-ssl.sh`) и добавить запись в hosts.

### 3. Docker — production (prod)

Сборка образов по одному на сервис, запуск в одной сети. Наружу открыт только порт 80 (nginx).

```bash
docker compose -f docker/docker-compose.prod.yml up --build -d
```

- Вход: **http://&lt;хост&gt;:80**
- Nginx раздаёт статику frontend и проксирует `/api/` и `/ws/` на api и ws.

### 4. Сборка (без Docker)

```bash
npm run build              # все сервисы
npm run build:frontend     # только frontend
npm run build:api          # только api
npm run build:ws           # только ws
```

### 5. Smoke tests (API)

```bash
# разовый прогон smoke-тестов API (из корня)
npm run test:smoke

# watch-режим smoke-тестов API
npm run test:smoke:watch
```

### 6. CI/CD (Production)

GitHub Actions: при push в `main` — сборка, smoke-тесты, deploy по SSH.  
Настройка: см. **`.github/DEPLOY.md`**.

---

Переменные окружения — см. **`.env.example`**.
