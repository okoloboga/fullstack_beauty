FROM nginx:alpine

# Копируем сборку из фронтенда, используя multi-stage build
COPY --from=frontend /app/build /usr/share/nginx/html

# Копируем файл конфигурации Nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
