import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppConfigService } from '../../config/shared-config.service';
import { AppConfigModule } from '../../config/config.module';
import { MailWeatherQueueService } from './mail-weather.queue.sevice';
import { MailWeatherQueueProcessor } from './mail-weather.queue.processor';
import { QUEUE_NAMES } from '../constants';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { WeatherService } from '../../infrastructure/weather/services/weather.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    AppConfigModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAMES.MAIL_WEATHER,
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => {
        console.log('HOST', configService.get('redis.REDIS_EMAIL_HOST'));

        return {
          connection: {
            host: configService.get('redis.REDIS_EMAIL_HOST'),
            port: configService.get('redis.REDIS_EMAIL_PORT'),
          },
        };
      },
      inject: [AppConfigService],
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
