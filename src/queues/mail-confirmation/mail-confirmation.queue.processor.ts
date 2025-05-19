import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../constants';
import { Job } from 'bullmq';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { MailFactory } from '../../infrastructure/mail/factory/mail.factory';
import { Subscription } from '../../modules/subscription/entities/subsciption.entity';

@Processor(QUEUE_NAMES.MAIL_CONFIRMATION)
export class MailQueueProcessor extends WorkerHost {
  private mailFactory = new MailFactory();

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<Subscription>): Promise<any> {
    await this.mailService.sendEmail(
      this.mailFactory.createSubscriptionConfirmationMail(job.data),
    );
  }
}
