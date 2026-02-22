# Production: только api — REST на Fastify
# Сборка: context = api/ (docker build -f api/Dockerfile api/)
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
