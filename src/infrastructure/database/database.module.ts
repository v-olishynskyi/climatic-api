import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from '../../config/shared-config.service';
import { AppConfigModule } from '../../config/config.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      imports: [AppConfigModule],

      useFactory: (configService: AppConfigService) => ({
        type: 'postgres',
        host: configService.get('pg.POSTGRES_HOST'),
        port: configService.get('pg.POSTGRES_PORT'),
        username: configService.get('pg.POSTGRES_USER'),
        password: configService.get('pg.POSTGRES_PASSWORD'),
        database: configService.get('pg.POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production',
        autoLoadEntities: true,
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
