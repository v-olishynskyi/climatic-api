import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppConfigService } from '../../config/shared-config.service';
import { AppConfigModule } from '../../config/config.module';
import { MailConfirmationQueueService } from './mail-confirmation.queue.sevice';
import { MailQueueProcessor } from './mail-confirmation.queue.processor';
import { QUEUE_NAMES, QUEUES_DB } from '../constants';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    AppConfigModule,
    BullModule.registerQueueAsync({
      name: QUEUE_NAMES.MAIL_CONFIRMATION,
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => {
        console.log('HOST', configService.get('redis.REDIS_HOST'));

        return {
          connection: {
            host: configService.get('redis.REDIS_HOST'),
            port: configService.get('redis.REDIS_PORT'),
            db: QUEUES_DB.MAIL_CONFIRMATION,
          },
        };
      },
      inject: [AppConfigService],
    }),
    BullBoardModule.forFeature({
      name: QUEUE_NAMES.MAIL_CONFIRMATION,
      adapter: BullMQAdapter, //or use BullAdapter if you're using bull instead of bullMQ
    }),
  ],
  providers: [MailService, MailConfirmationQueueService, MailQueueProcessor],
  exports: [MailConfirmationQueueService],
})
export class MailConfirmationQueuesModule {}
