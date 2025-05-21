import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { WeatherHourlyQueueService } from './weather-hourly.queue.service';
import { WeatherHourlyQueueProcessor } from './weather-hourly.queue.processor';
import { QueueFactory } from '../../factory/queue.factory';
import { AppConfigModule } from '../../../config/config.module';
import { MailModule } from '../../../infrastructure/mail/mail.module';
import { QUEUE_NAMES } from '../../constants';
import { MailService } from '../../../infrastructure/mail/services/mail.service';

@Module({
  imports: [
    AppConfigModule,
    MailModule,
    BullModule.registerQueueAsync(
      QueueFactory.createQueueRegistrations(QUEUE_NAMES.MAIL_WEATHER_HOURLY),
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
