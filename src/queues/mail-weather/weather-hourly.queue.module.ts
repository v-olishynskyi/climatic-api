import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppConfigService } from '../../config/shared-config.service';
import { AppConfigModule } from '../../config/config.module';
import { QUEUE_NAMES, QUEUES_DB } from '../constants';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { WeatherHourlyQueueService } from './weather-hourly.queue.service';
import { WeatherHourlyQueueProcessor } from './weather-hourly.queue.processor';

@Module({
  imports: [
    AppConfigModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAMES.MAIL_WEATHER_HOURLY,
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => ({
        connection: {
          host: configService.get('redis.REDIS_HOST'),
          port: configService.get('redis.REDIS_PORT'),
          db: QUEUES_DB.MAIL_WEATHER_HOURLY,
        },
      }),
      inject: [AppConfigService],
    }),
    BullBoardModule.forFeature({
      name: QUEUE_NAMES.MAIL_WEATHER_HOURLY,
      adapter: BullMQAdapter, //or use BullAdapter if you're using bull instead of bullMQ
    }),
  ],
  providers: [
    MailService,
    WeatherHourlyQueueService,
    WeatherHourlyQueueProcessor,
  ],
  exports: [WeatherHourlyQueueService],
})
export class WeatherHourlyQueuesModule {}
