import { Module } from '@nestjs/common';
import { WeatherDailyQueuesModule } from './mail-weather/weather-daily.queue.module';
import { MailConfirmationQueuesModule } from './mail-confirmation/mail-confirmation.queue.module';
import { WeatherHourlyQueuesModule } from './mail-weather/weather-hourly.queue.module';
import { WeatherQueueDispatcher } from './mail-weather/weather-queue-dispatcher.service';

@Module({
  imports: [
    WeatherDailyQueuesModule,
    WeatherHourlyQueuesModule,
    MailConfirmationQueuesModule,
  ],
  providers: [WeatherQueueDispatcher],
  exports: [WeatherQueueDispatcher],
})
export class QueuesModule {}
