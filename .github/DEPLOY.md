# CI/CD Production Deploy

При каждом push в `main` запускается workflow **Deploy Production**:
1. **build-and-test** — npm ci, build, smoke-тесты
2. **build-and-push** — сборка образов api, ws, web и push в GitHub Container Registry (ghcr.io)
3. **deploy** — запуск `docker compose` на VPS через DOCKER_HOST=ssh://

## Настройка GitHub

### 1. Environment `production`
В репозитории: **Settings → Environments → New environment** → имя `production`.

### 2. Secrets (Settings → Secrets and variables → Actions)

| Secret | Описание |
|--------|----------|
| `VPS_SSH_KEY` | Приватный ключ SSH для доступа к VPS (без passphrase) |
| `VPS_HOST` | IP или hostname сервера |
| `VPS_USERNAME` | Пользователь SSH на VPS |
| `PROD_ENV` | Полное содержимое `.env` для production (скопировать из `.env.example` и заполнить) |

### 3. Variables (опционально, для сборки frontend)

| Variable | Описание |
|----------|----------|
| `VITE_APP_URL` | Публичный URL приложения (например `https://example.com/`) |
| `VITE_STATS_WS_URL` | WebSocket URL (например `wss://example.com/ws`) |

### 4. Подготовка VPS
- Установить Docker и Docker Compose v2
- Настроить доступ к GHCR (на VPS выполнить `docker login ghcr.io` с PAT, чтобы daemon мог пуллить образы)
- Добавить публичный ключ SSH в `~/.ssh/authorized_keys` для `VPS_USERNAME`

### 5. Ручной запуск
**Actions → Deploy Production → Run workflow**
