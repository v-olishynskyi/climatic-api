import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { QueueNamesEnum, ClientNames } from './enum';
import { SubscriptionConfirmationMailService } from './subscription-confirmation-mail/subscription-confirmation-mail.service';
import { SubscriptionConfirmationMailConsumer } from './subscription-confirmation-mail/subscription-confirmation-mail.consumer';
import { WeatherUpdateDailyMailService } from './weather-update-mail/daily/weather-update-daily-mail.service';
import { WeatherUpdateHourlyMailService } from './weather-update-mail/hourly/weather-update-hourly-mail.service';
import { WeatherUpdateDailyMailConsumer } from './weather-update-mail/daily/weather-update-daily-mail.consumer';
import { WeatherUpdateHourlyConsumer } from './weather-update-mail/hourly/weather-update-hourly-mail.consumer';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { MailModule } from '../../infrastructure/mail/mail.module';
import { WeatherQueueDispatcher } from './weather-update-mail/weather-queue-dispatcher.service';
import RabbitMQFactory from './factory/rabbitmq.factory';

@Module({
  imports: [
    MailModule,
    ClientsModule.registerAsync([
      {
        name: RabbitMQFactory.resolveClientName(
          ClientNames.SUBSCRIPTION_CONFIRMATION_MAIL,
        ),
        useFactory: () =>
          RabbitMQFactory.createRabbitMQClientOptions(
            QueueNamesEnum.SUBSCRIPTION_CONFIRMATION_MAIL_QUEUE,
          ),
      },
      {
        name: RabbitMQFactory.resolveClientName(
          ClientNames.WEATHER_UPDATE_HOURLY_MAIL,
        ),
        useFactory: () =>
          RabbitMQFactory.createRabbitMQClientOptions(
            QueueNamesEnum.WEATHER_UPDATE_HOURLY_MAIL_QUEUE,
          ),
      },
      {
        name: RabbitMQFactory.resolveClientName(
          ClientNames.WEATHER_UPDATE_DAILY_MAIL,
        ),
        useFactory: () =>
          RabbitMQFactory.createRabbitMQClientOptions(
            QueueNamesEnum.WEATHER_UPDATE_DAILY_MAIL_QUEUE,
          ),
      },
    ]),
  ],
  exports: [ClientsModule],
  providers: [
    MailService,
    SubscriptionConfirmationMailService,
    WeatherUpdateDailyMailService,
    WeatherUpdateHourlyMailService,
    WeatherQueueDispatcher,
  ],
  controllers: [
    SubscriptionConfirmationMailConsumer,
    WeatherUpdateDailyMailConsumer,
    WeatherUpdateHourlyConsumer,
  ],
})
export class RabbitMQModule {}
