import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppConfigService } from '../../config/shared-config.service';
import { AppConfigModule } from '../../config/config.module';
import { MailWeatherQueueService } from './mail-weather.queue.sevice';
import { MailWeatherQueueProcessor } from './mail-weather.queue.processor';
import { QUEUE_NAMES, QUEUES_DB } from '../constants';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { WeatherService } from '../../infrastructure/weather/services/weather.service';
import { HttpModule } from '@nestjs/axios';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
@Module({
  imports: [
    HttpModule,
    AppConfigModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAMES.MAIL_WEATHER,
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => {
        console.log('HOST', configService.get('redis.REDIS_HOST'));

        return {
          connection: {
            host: configService.get('redis.REDIS_HOST'),
            port: configService.get('redis.REDIS_PORT'),
            db: QUEUES_DB.MAIL_WEATHER,
          },
        };
      },
      inject: [AppConfigService],
    }),
    BullBoardModule.forFeature({
      name: QUEUE_NAMES.MAIL_WEATHER,
      adapter: BullMQAdapter, //or use BullAdapter if you're using bull instead of bullMQ
    }),
  ],
  providers: [
    MailService,
    WeatherService,
    MailWeatherQueueService,
    MailWeatherQueueProcessor,
  ],
  exports: [MailWeatherQueueService],
})
export class MailWeatherQueuesModule {}
