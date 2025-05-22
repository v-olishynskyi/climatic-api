import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppConfigModule } from '../../config/config.module';
import { MailConfirmationQueueService } from './mail-confirmation.queue.service';
import { MailQueueProcessor } from './mail-confirmation.queue.processor';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { MailModule } from '../../infrastructure/mail/mail.module';
import { QueueFactory } from '../factory/queue.factory';
import { QueueNamesEnum } from '../enum';

@Module({
  imports: [
    AppConfigModule,
    MailModule,
    BullModule.registerQueueAsync(
      QueueFactory.createQueueRegistrations(QueueNamesEnum.MAIL_CONFIRMATION),
    ),
  ],
  providers: [MailService, MailConfirmationQueueService, MailQueueProcessor],
  exports: [MailConfirmationQueueService],
})
export class MailConfirmationQueuesModule {}
