# frontend/Dockerfile

FROM node:16

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

# Открываем порт для доступа
EXPOSE 3000

# Запуск сервер для разработки (например, React)
CMD ["npm", "start"]  # Запускаем сервер разработки React
