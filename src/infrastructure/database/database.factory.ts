import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { Subscription } from '../../modules/subscription/entities/subsciption.entity';

const NODE_ENV = process.env.NODE_ENV || 'development';

export class DatabaseFactory {
  static createDatabaseOptions<T extends object>(
    restOptions?: T,
  ): TypeOrmModuleOptions & DataSourceOptions {
    return {
      schema: 'public',
      type: 'postgres',

      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT || 5432),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,

      entities: [Subscription],
      migrations: [__dirname + '/migrations/*.{.ts,.js}'],
      synchronize: NODE_ENV !== 'production',
      autoLoadEntities: true,
      logging: NODE_ENV !== 'production',
      ssl: NODE_ENV === 'production',
      ...(NODE_ENV === 'production'
        ? {
            extra: {
              ssl: {
                rejectUnauthorized: false,
              },
            },
          }
        : {}),
      ...restOptions,
    };
  }
}
