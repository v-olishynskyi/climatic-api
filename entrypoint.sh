#!/bin/sh

echo "📡 Waiting for PostgreSQL to be ready..."
until pg_isready -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_NAME"; do
  echo "⏳ Waiting for database..."
  sleep 2
done

echo "📦 Running migrations..."
npx typeorm migration:run -d dist/infrastructure/database/typeorm.config.js
echo "✅ Migrations finished"

echo "🚀 Starting NestJS application..."
node dist/main.js
