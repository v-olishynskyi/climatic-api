import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppConfigService } from '../../config/shared-config.service';
import { AppConfigModule } from '../../config/config.module';
import { MailConfirmationQueueService } from './mail-confirmation.queue.service';
import { MailQueueProcessor } from './mail-confirmation.queue.processor';
import { QUEUE_NAMES, QUEUES_DB } from '../constants';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { MailModule } from '../../infrastructure/mail/mail.module';

@Module({
  imports: [
    AppConfigModule,
    MailModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAMES.MAIL_CONFIRMATION,
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => {
        console.log('MailConfirmationQueuesModule', {
          host: configService.get('redis.REDIS_HOST'),
          port: configService.get('redis.REDIS_PORT'),
          db: QUEUES_DB.MAIL_CONFIRMATION,
        });

        return {
          connection: {
            host: configService.get('redis.REDIS_HOST'),
            port: configService.get('redis.REDIS_PORT'),
            db: QUEUES_DB.MAIL_CONFIRMATION,
            ...(process.env.NODE_END === 'production' ? { tls: {} } : {}),
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
