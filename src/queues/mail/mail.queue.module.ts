import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppConfigService } from '../../config/shared-config.service';
import { AppConfigModule } from '../../config/config.module';
import { MailQueueService } from './mail.queue.sevice';
import { MailQueueProcessor } from './mail.queue.processor';
import { QUEUE_NAMES } from '../constants';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { WeatherService } from '../../infrastructure/weather/services/weather.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    AppConfigModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAMES.MAIL,
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
    MailQueueService,
    MailQueueProcessor,
  ],
  exports: [MailQueueService],
})
export class MailQueuesModule {}
