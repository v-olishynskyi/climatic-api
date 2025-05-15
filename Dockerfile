# ===== Базовий імідж =====
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Якщо ENV = production — запускаємо компіляцію
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

CMD if [ "$NODE_ENV" = "production" ]; then node dist/main.js; else npm run start:dev; fi

# TODO: Залишити тільки те, що потрібно для продакшена
RUN mkdir -p dist/infrastructure/mail/templates && \
    cp src/infrastructure/mail/templates/*.hbs dist/infrastructure/mail/templates/
