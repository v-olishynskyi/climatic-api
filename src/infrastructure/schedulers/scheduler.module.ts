import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { SubscriptionModule } from '../../modules/subscription/subscription.module';
import { WeatherDailyQueuesModule } from '../../queues/mail-weather/weather-daily.queue.module';
import { WeatherSchedulerService } from './services/weather-scheduler.service';
import { SubscriptionService } from '../../modules/subscription/services/subscription.service';
import { MailConfirmationQueuesModule } from '../../queues/mail-confirmation/mail-confirmation.queue.module';
import { WeatherModule } from '../weather/weather.module';
import { WeatherHourlyQueuesModule } from '../../queues/mail-weather/weather-hourly.queue.module';
import { WeatherQueueDispatcher } from '../../queues/mail-weather/weather-queue-dispatcher.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule,
    SubscriptionModule,
    MailConfirmationQueuesModule,
    WeatherModule,
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
