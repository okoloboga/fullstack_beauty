# backend/Dockerfile

FROM node:16 as build

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем все файлы проекта в контейнер
COPY . .

# Копируем скрипт wait-for.sh в контейнер и назначаем права на выполнение
COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

# Компилируем TypeScript в JavaScript
RUN npm run build

# Запускаем приложение из скомпилированных файлов
EXPOSE 4000
CMD ["npm", "run", "start"]
