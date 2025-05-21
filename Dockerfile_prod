# ───── STAGE 1: build ─────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ───── STAGE 2: production ─────
FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /app

RUN apk add --no-cache postgresql-client

# Копіюємо лише необхідне для запуску
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# TypeORM config + migration scripts
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /app/src/infrastructure/database ./src/infrastructure/database

# Копіюємо entrypoint.sh
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

CMD ["sh", "./entrypoint.sh"]
