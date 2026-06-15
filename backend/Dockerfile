FROM node:20-bookworm

WORKDIR /app

# системные зависимости
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# 1. копируем зависимости ПЕРВЫМИ
COPY package*.json ./

# ВАЖНО: ставим строго по lock-файлу
RUN npm ci

# 2. prisma отдельно (чтобы не ломался generate)
COPY prisma ./prisma
RUN npx prisma generate

# 3. потом весь код
COPY src ./src

EXPOSE 4000

CMD ["npm", "start"]