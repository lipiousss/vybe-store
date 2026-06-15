FROM mirror.gcr.io/library/node:20-bookworm

WORKDIR /app

RUN sed -i 's|http://deb.debian.org/debian|https://mirror.yandex.ru/debian|g; s|http://deb.debian.org/debian-security|https://mirror.yandex.ru/debian-security|g' /etc/apt/sources.list.d/debian.sources \
  && apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY src ./src

EXPOSE 4000

CMD ["npm", "start"]
