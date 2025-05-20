// src/worker.module.ts
import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config/config.module';
import { MailConfirmationQueuesModule } from './mail-confirmation/mail-confirmation.queue.module';
import { WeatherDailyQueuesModule } from './mail-weather/weather-daily.queue.module';
import { WeatherHourlyQueuesModule } from './mail-weather/weather-hourly.queue.module';

@Module({
  imports: [
    AppConfigModule,
    MailConfirmationQueuesModule,
    WeatherDailyQueuesModule,
    WeatherHourlyQueuesModule,
  ],
})
export class WorkerModule {}
