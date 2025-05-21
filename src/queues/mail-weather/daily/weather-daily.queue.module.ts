import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppConfigModule } from '../../../config/config.module';
import { MailModule } from '../../../infrastructure/mail/mail.module';
import { QueueFactory } from '../../factory/queue.factory';
import { QUEUE_NAMES } from '../../constants';
import { MailService } from '../../../infrastructure/mail/services/mail.service';
import { WeatherDailyQueueService } from './weather-daily.queue.service';
import { WeatherDailyQueueProcessor } from './weather-daily.queue.processor';

@Module({
  imports: [
    AppConfigModule,
    MailModule,
    BullModule.registerQueueAsync(
      QueueFactory.createQueueRegistrations(QUEUE_NAMES.MAIL_WEATHER_DAILY),
    ),
  ],
  providers: [
    MailService,
    WeatherDailyQueueService,
    WeatherDailyQueueProcessor,
  ],
  exports: [WeatherDailyQueueService],
})
export class WeatherDailyQueuesModule {}
