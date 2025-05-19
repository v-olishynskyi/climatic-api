import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { SubscriptionModule } from '../../modules/subscription/subscription.module';
import { MailWeatherQueuesModule } from '../../queues/mail-weather/mail-weather.queue.module';
import { WeatherSchedulerService } from './services/weather-scheduler.service';
import { SubscriptionService } from '../../modules/subscription/services/subscription.service';
import { MailConfirmationQueuesModule } from '../../queues/mail-confirmation/mail-confirmation.queue.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule,
    SubscriptionModule,
    MailWeatherQueuesModule,
    MailConfirmationQueuesModule,
    WeatherModule,
  ],
  providers: [SubscriptionService, WeatherSchedulerService],
})
export class SchedulerModule {}
