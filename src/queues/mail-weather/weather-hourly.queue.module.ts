import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppConfigService } from '../../config/shared-config.service';
import { AppConfigModule } from '../../config/config.module';
import { QUEUE_NAMES, QUEUES_DB } from '../constants';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { WeatherHourlyQueueService } from './weather-hourly.queue.service';
import { WeatherHourlyQueueProcessor } from './weather-hourly.queue.processor';
import { MailModule } from '../../infrastructure/mail/mail.module';

@Module({
  imports: [
    AppConfigModule,
    MailModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAMES.MAIL_WEATHER_HOURLY,
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => {
        console.log('WeatherHourlyQueuesModule', {
          host: configService.get('redis.REDIS_HOST'),
          port: configService.get('redis.REDIS_PORT'),
          db: QUEUES_DB.MAIL_CONFIRMATION,
        });

        return {
          connection: {
            host: configService.get('redis.REDIS_HOST'),
            port: configService.get('redis.REDIS_PORT'),
            db: QUEUES_DB.MAIL_WEATHER_HOURLY,
            ...(process.env.NODE_END === 'production' ? { tls: {} } : {}),
          },
        };
      },
      inject: [AppConfigService],
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
