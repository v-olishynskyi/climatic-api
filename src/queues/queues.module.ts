import { Module } from '@nestjs/common';
import { WeatherDailyQueuesModule } from './mail-weather/daily/weather-daily.queue.module';
import { MailConfirmationQueuesModule } from './mail-confirmation/mail-confirmation.queue.module';
import { WeatherHourlyQueuesModule } from './mail-weather/hourly/weather-hourly.queue.module';
import { WeatherQueueDispatcher } from './mail-weather/weather-queue-dispatcher.service';

@Module({
  imports: [
    MailConfirmationQueuesModule,
    WeatherDailyQueuesModule,
    WeatherHourlyQueuesModule,
  ],
  providers: [WeatherQueueDispatcher],
  exports: [WeatherQueueDispatcher],
})
export class QueuesModule {}
