import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppConfigService } from '../../config/shared-config.service';
import { AppConfigModule } from '../../config/config.module';
import { WeatherDailyQueueService } from './weather-daily.queue.service';
import { WeatherDailyQueueProcessor } from './weather-daily.queue.processor';
import { QUEUE_NAMES, QUEUES_DB } from '../constants';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { MailModule } from '../../infrastructure/mail/mail.module';

@Module({
  imports: [
    AppConfigModule,
    MailModule,
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
  ],
  providers: [
    MailService,
    WeatherDailyQueueService,
    WeatherDailyQueueProcessor,
  ],
  exports: [WeatherDailyQueueService],
})
export class WeatherDailyQueuesModule {}
