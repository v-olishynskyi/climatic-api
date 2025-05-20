// src/worker.module.ts
import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config/config.module';
import { MailConfirmationQueuesModule } from './mail-confirmation/mail-confirmation.queue.module';
import { WeatherDailyQueuesModule } from './mail-weather/weather-daily.queue.module';
import { WeatherHourlyQueuesModule } from './mail-weather/weather-hourly.queue.module';
import { ConfigModule } from '@nestjs/config';
import configurations from '../config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: configurations }),
    AppConfigModule,
    MailConfirmationQueuesModule,
    WeatherDailyQueuesModule,
    WeatherHourlyQueuesModule,
  ],
})
export class WorkerModule {}
