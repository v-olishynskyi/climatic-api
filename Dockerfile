# ───── STAGE 1: build ─────
FROM node:20-alpine AS builder

WORKDIR /var/www/application

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ───── STAGE 2: production ─────
FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /var/www/application

RUN apk add --no-cache postgresql-client

# Копіюємо з builder лише необхідне для запуску
COPY --from=builder /var/www/application/dist ./dist
COPY --from=builder /var/www/application/node_modules ./node_modules
COPY --from=builder /var/www/application/package.json ./package.json
COPY --from=builder /var/www/application/src/views ./dist/views

# TypeORM config + migration scripts
COPY --from=builder /var/www/application/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /var/www/application/src/infrastructure/database ./src/infrastructure/database

# Копіюємо entrypoint.sh
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

CMD ["sh", "./entrypoint.sh"]
