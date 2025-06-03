import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from '../../config/shared-config.service';
import { AppConfigModule } from '../../config/config.module';
import { DatabaseFactory } from './database.factory';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      imports: [AppConfigModule],

      useFactory: () => DatabaseFactory.createDatabaseOptions(),
    }),
  ],
})
export class DatabaseModule {}
