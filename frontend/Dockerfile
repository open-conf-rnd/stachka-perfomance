# Production: только frontend — сборка и раздача через nginx
# Сборка: context = frontend/ (docker build -f frontend/Dockerfile frontend/)
FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_APP_URL
ARG VITE_STATS_WS_URL
ENV VITE_APP_URL=$VITE_APP_URL
ENV VITE_STATS_WS_URL=$VITE_STATS_WS_URL

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
