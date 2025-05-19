import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppConfigService } from '../../config/shared-config.service';
import { AppConfigModule } from '../../config/config.module';
import { WeatherDailyQueueService } from './weather-daily.queue.service';
import { WeatherDailyQueueProcessor } from './weather-daily.queue.processor';
import { QUEUE_NAMES, QUEUES_DB } from '../constants';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    AppConfigModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAMES.MAIL_WEATHER_DAILY,
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => {
        return {
          connection: {
            host: configService.get('redis.REDIS_HOST'),
            port: configService.get('redis.REDIS_PORT'),
            db: QUEUES_DB.MAIL_WEATHER_DAILY,
          },
        };
      },
      inject: [AppConfigService],
    }),
    BullBoardModule.forFeature({
      name: QUEUE_NAMES.MAIL_WEATHER_DAILY,
      adapter: BullMQAdapter, //or use BullAdapter if you're using bull instead of bullMQ
    }),
  ],
  providers: [
    MailService,
    WeatherDailyQueueService,
    WeatherDailyQueueProcessor,
  ],
  exports: [WeatherDailyQueueService],
})
export class WeatherDailyQueuesModule {}
