# nginx/Dockerfile

FROM nginx:alpine

# Копируем основной файл конфигурации Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем файл конфигурации сервера (default.conf)
COPY default.conf /etc/nginx/conf.d/default.conf

# Копируем статические файлы, созданные фронтендом
COPY --from=custom-frontend:1.0 /app/build /usr/share/nginx/html

EXPOSE 80
