# Используем базовый образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock) в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальную часть приложения в контейнер
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Сборка приложения
RUN npm run build

# Указываем команду для запуска приложения
CMD ["npm", "run", "start:prod"]

# Экспонируем порт
EXPOSE 4000
