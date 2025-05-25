import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { SubscriptionModule } from '../../modules/subscription/subscription.module';
import { WeatherDailyQueuesModule } from '../../queues/mail-weather/daily/weather-daily.queue.module';
import { WeatherSchedulerService } from './services/weather-scheduler.service';
import { SubscriptionService } from '../../modules/subscription/services/subscription.service';
import { MailConfirmationQueuesModule } from '../../queues/mail-confirmation/mail-confirmation.queue.module';
import { WeatherModule } from '../weather/weather.module';
import { WeatherHourlyQueuesModule } from '../../queues/mail-weather/hourly/weather-hourly.queue.module';
import { RabbitMQModule } from '../../queues/rabbitmq/rabbitmq.module';
import { SubscriptionConfirmationMailService } from '../../queues/rabbitmq/subscription-confirmation-mail/subscription-confirmation-mail.service';
import { WeatherQueueDispatcher } from '../../queues/rabbitmq/weather-update-mail/weather-queue-dispatcher.service';
import { WeatherUpdateHourlyMailService } from '../../queues/rabbitmq/weather-update-mail/hourly/weather-update-hourly-mail.service';
import { WeatherUpdateDailyMailService } from '../../queues/rabbitmq/weather-update-mail/daily/weather-update-daily-mail.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule,
    SubscriptionModule,
    WeatherModule,
    MailConfirmationQueuesModule,
    WeatherDailyQueuesModule,
    WeatherHourlyQueuesModule,
    RabbitMQModule,
  ],
  providers: [
    SubscriptionService,
    WeatherSchedulerService,
    SubscriptionConfirmationMailService,
    WeatherUpdateHourlyMailService,
    WeatherUpdateDailyMailService,
    WeatherQueueDispatcher,
  ],
})
export class SchedulerModule {}
