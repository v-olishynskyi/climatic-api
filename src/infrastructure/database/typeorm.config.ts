import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

const NODE_ENV = process.env.NODE_ENV || 'development';

// Завантажує відповідне .env
dotenv.config({
  path: NODE_ENV === 'production' ? '.env.prod' : '.env',
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false, // завжди false для прод
  logging: NODE_ENV !== 'production',

  // .ts файли у dev, .js файли у прод
  entities: [
    NODE_ENV === 'production'
      ? path.join(__dirname, '../../**/*.entity.js')
      : path.join(__dirname, '../../**/*.entity.ts'),
  ],
  migrations: [
    NODE_ENV === 'production'
      ? path.join(__dirname, './migrations/*.js')
      : path.join(__dirname, './migrations/*.ts'),
  ],
});
