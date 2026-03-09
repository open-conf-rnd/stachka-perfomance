# Production: только ws — WebSocket статистики
# Сборка: context = ws/ (docker build -f ws/Dockerfile ws/)
FROM node:22-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build \
  && npm prune --omit=dev

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/index.js"]
