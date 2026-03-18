# Production: только api — REST на Fastify
# Сборка: context = api/ (docker build -f api/Dockerfile api/)
# --no-optional исключает @prisma/studio-core (не нужен в prod), уменьшает образ
FROM node:22-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --no-optional

COPY . .
RUN npm run build \
  && npm prune --omit=dev

ENV NODE_ENV=production

EXPOSE 3000

# Apply pending migrations then start the app (POSTGRES_* from env at runtime)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
