import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppConfigService } from '../../config/shared-config.service';
import { AppConfigModule } from '../../config/config.module';
import { MailConfirmationQueueService } from './mail-confirmation.queue.sevice';
import { MailQueueProcessor } from './mail-confirmation.queue.processor';
import { QUEUE_NAMES } from '../constants';
import { MailService } from '../../infrastructure/mail/services/mail.service';

@Module({
  imports: [
    AppConfigModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAMES.MAIL_CONFIRMATION,
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
  providers: [MailService, MailConfirmationQueueService, MailQueueProcessor],
  exports: [MailConfirmationQueueService],
})
export class MailConfirmationQueuesModule {}
