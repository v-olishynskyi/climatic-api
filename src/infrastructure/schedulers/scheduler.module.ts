import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { SubscriptionModule } from '../../modules/subscription/subscription.module';
import { WeatherDailyQueuesModule } from '../../queues/mail-weather/daily/weather-daily.queue.module';
import { WeatherSchedulerService } from './services/weather-scheduler.service';
import { SubscriptionService } from '../../modules/subscription/services/subscription.service';
import { MailConfirmationQueuesModule } from '../../queues/mail-confirmation/mail-confirmation.queue.module';
import { WeatherModule } from '../weather/weather.module';
import { WeatherQueueDispatcher } from '../../queues/mail-weather/weather-queue-dispatcher.service';
import { WeatherHourlyQueuesModule } from '../../queues/mail-weather/hourly/weather-hourly.queue.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule,
    SubscriptionModule,
    WeatherModule,
    MailConfirmationQueuesModule,
    WeatherDailyQueuesModule,
    WeatherHourlyQueuesModule,
  ],
  providers: [
    SubscriptionService,
    WeatherSchedulerService,
    WeatherQueueDispatcher,
  ],
})
export class SchedulerModule {}
