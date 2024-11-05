FROM nginx:alpine

# Копируем основной файл конфигурации Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем файл конфигурации сервера (default.conf)
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
