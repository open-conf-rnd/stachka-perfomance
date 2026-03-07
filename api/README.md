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
- тесты используют `DATABASE_URL` (если не задана, используется `postgresql://stachka:stachka@localhost:5432/stachka`);
- таймеры reaction в smoke принудительно обнулены через env, чтобы тесты выполнялись быстро и стабильно.
