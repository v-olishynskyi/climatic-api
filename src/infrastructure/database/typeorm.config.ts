import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { SeederOptions } from 'typeorm-extension';
import { DatabaseFactory } from './database.factory';

const NODE_ENV = process.env.NODE_ENV || 'development';

// Завантажує відповідне .env
dotenv.config({
  path: NODE_ENV === 'production' ? '.env.prod' : '.env',
});

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
const options: DataSourceOptions & SeederOptions = {
  ...DatabaseFactory.createDatabaseOptions(),
  seeds: [
    NODE_ENV === 'production'
      ? path.join(__dirname, './seeds/*.js')
      : path.join(__dirname, './seeds/*.ts'),
  ],
  factories: [
    NODE_ENV === 'production'
      ? path.join(__dirname, './factories/*.js')
      : path.join(__dirname, './factories/*.ts'),
  ],
  seedTracking: false, // відстеження виконання сідів
};

export const AppDataSource = new DataSource(options);
