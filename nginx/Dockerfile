FROM nginx:alpine

# Копируем основной файл конфигурации Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем файл конфигурации сервера (default.conf)
COPY default.conf /etc/nginx/conf.d/default.conf

# Копируем скрипт wait-for.sh в контейнер
COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

EXPOSE 80
