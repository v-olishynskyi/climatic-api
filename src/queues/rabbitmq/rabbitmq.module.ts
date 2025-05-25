import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
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

@Module({
  imports: [
    MailModule,
    ClientsModule.registerAsync([
      {
        name: ClientNames.SUBSCRIPTION_CONFIRMATION_MAIL,
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://guest:guest@rabbitmq:5672'],
            queue: QueueNamesEnum.SUBSCRIPTION_CONFIRMATION_MAIL_QUEUE,
            queueOptions: { durable: true },
          },
        }),
      },
      {
        name: ClientNames.WEATHER_UPDATE_HOURLY_MAIL,
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://guest:guest@rabbitmq:5672'],
            queue: QueueNamesEnum.WEATHER_UPDATE_HOURLY_MAIL_QUEUE,
            queueOptions: { durable: true },
          },
        }),
      },
      {
        name: ClientNames.WEATHER_UPDATE_DAILY_MAIL,
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://guest:guest@rabbitmq:5672'],
            queue: QueueNamesEnum.WEATHER_UPDATE_DAILY_MAIL_QUEUE,
            queueOptions: { durable: true },
          },
        }),
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
