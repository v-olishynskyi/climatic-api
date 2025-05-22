import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { WeatherHourlyQueueService } from './weather-hourly.queue.service';
import { WeatherHourlyQueueProcessor } from './weather-hourly.queue.processor';
import { QueueFactory } from '../../factory/queue.factory';
import { AppConfigModule } from '../../../config/config.module';
import { MailModule } from '../../../infrastructure/mail/mail.module';
import { MailService } from '../../../infrastructure/mail/services/mail.service';
import { QueueNamesEnum } from '../../enum';

@Module({
  imports: [
    AppConfigModule,
    MailModule,
    BullModule.registerQueueAsync(
      QueueFactory.createQueueRegistrations(QueueNamesEnum.MAIL_WEATHER_HOURLY),
    ),
  ],
  providers: [
    MailService,
    WeatherHourlyQueueService,
    WeatherHourlyQueueProcessor,
  ],
  exports: [WeatherHourlyQueueService],
})
export class WeatherHourlyQueuesModule {}
