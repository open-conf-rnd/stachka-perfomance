# Production: только frontend — сборка и раздача через nginx
# Сборка: context = корень репо (docker build -f frontend/Dockerfile .)
FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_APP_URL
ARG VITE_STATS_WS_URL
ENV VITE_APP_URL=$VITE_APP_URL
ENV VITE_STATS_WS_URL=$VITE_STATS_WS_URL

COPY frontend/package.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx/nginx.prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
