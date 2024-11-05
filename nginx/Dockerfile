# nginx/Dockerfile

FROM nginx:alpine

# Копируем основной файл конфигурации Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем файл конфигурации сервера (default.conf)
COPY default.conf /etc/nginx/conf.d/default.conf

# Копируем собранные статические файлы фронтенда
COPY --from=frontend /app/build /usr/share/nginx/html

EXPOSE 80
