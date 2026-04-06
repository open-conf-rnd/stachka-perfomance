# Production: только frontend — сборка и раздача через nginx
# Сборка: context = корень репо (docker build -f frontend/Dockerfile .)
#
# Vite подставляет VITE_* только на этапе сборки — передайте через --build-arg
# (CI: deploy-prod.yml → secrets; локально: docker-compose.prod.yml args + .env.prod).
FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_YANDEX_MAPS_API_KEY=
ARG VITE_TG_BOT_USERNAME=
ARG VITE_VK_MINI_APP_URL=
ENV VITE_YANDEX_MAPS_API_KEY=$VITE_YANDEX_MAPS_API_KEY
ENV VITE_TG_BOT_USERNAME=$VITE_TG_BOT_USERNAME
ENV VITE_VK_MINI_APP_URL=$VITE_VK_MINI_APP_URL

COPY frontend/package.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx/nginx.prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
