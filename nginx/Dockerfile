# Stage 1: Build frontend
FROM node:16 as frontend-build

WORKDIR /app

# Копируем package.json и package-lock.json и устанавливаем зависимости
COPY ./frontend/package*.json ./
RUN npm install

# Копируем все файлы фронтенда и запускаем сборку
COPY ./frontend .
RUN npm run build

# Stage 2: Setup Nginx with built frontend
FROM nginx:alpine

# Копируем основной файл конфигурации Nginx
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Копируем файл конфигурации сервера (default.conf)
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Копируем собранные статические файлы фронтенда из предыдущего этапа
COPY --from=frontend-build /app/build /usr/share/nginx/html

EXPOSE 80
