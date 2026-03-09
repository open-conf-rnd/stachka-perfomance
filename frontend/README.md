# Frontend — TG Mini App

Telegram Mini App на React 18, TypeScript и Vite. Подключается к API и WebSocket по относительным путям при работе за nginx или по явным URL при локальном запуске.

## Стек

- React 18, TypeScript
- Vite 6
- [@telegram-apps/sdk-react](https://github.com/Telegram-Mini-Apps/sdk) — SDK для Mini App

## Скрипты

Из папки **frontend**:

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер Vite (порт 5173). |
| `npm run build` | Сборка в `dist/` (TypeScript + Vite). |
| `npm run preview` | Просмотр собранной статики. |
| `npm run lint` | ESLint. |

Из **корня** репозитория: `npm run dev` (frontend), `npm run build:frontend`.

## API и WebSocket

Берутся из текущего location: тот же хост, пути `/api/` и `/ws`. На **localhost:5173** (Vite) — `http://localhost:3000` и `ws://localhost:3001` (см. `src/config.ts`).

## Docker

- **Dockerfile** — production: сборка статики и nginx (образ только для frontend). Конфиг nginx — `docker/nginx/nginx.prod.conf` (прокси `/api/`, `/ws`).
- **Dockerfile.dev** — dev: Node + Vite, только содержимое папки frontend.

Сборка из корня через compose (context задаётся в compose). Отдельная сборка образа:

```bash
docker build -f frontend/Dockerfile .
docker build -f frontend/Dockerfile.dev frontend/
```

## Структура

```
frontend/
├── src/
│   ├── App.tsx       # Основной экран (проверка API/WS и т.п.)
│   ├── config.ts     # apiBase, wsUrl из location
│   ├── main.tsx      # Точка входа, SDKProvider
│   └── ...
├── index.html
├── vite.config.ts
├── Dockerfile        # Prod: build + nginx (конфиг в docker/nginx/)
├── Dockerfile.dev    # Dev: Vite
└── package.json
```
