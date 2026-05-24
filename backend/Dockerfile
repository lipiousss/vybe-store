FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY src ./src
COPY uploads ./uploads

EXPOSE 4000

CMD ["npm", "run", "dev"]
