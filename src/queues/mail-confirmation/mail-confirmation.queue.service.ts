import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QueueNamesEnum } from '../enum';
import { Queue } from 'bullmq';
import { Subscription } from '../../modules/subscription/entities/subsciption.entity';

@Injectable()
export class MailConfirmationQueueService {
  constructor(
    @InjectQueue(QueueNamesEnum.MAIL_CONFIRMATION)
    private readonly mailQueue: Queue<Subscription>,
  ) {}

  async sendConfirmationEmail(subscription: Subscription) {
    await this.mailQueue.add('sendConfirmationEmail', subscription, {
      attempts: 5,
      removeOnComplete: false,
      jobId: subscription.subscription_token,
    });
  }
}
