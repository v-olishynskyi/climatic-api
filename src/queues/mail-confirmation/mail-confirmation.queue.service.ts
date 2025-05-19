import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QUEUE_NAMES } from '../constants';
import { Queue } from 'bullmq';
import { Subscription } from '../../modules/subscription/entities/subsciption.entity';

@Injectable()
export class MailConfirmationQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.MAIL_CONFIRMATION)
    private readonly mailQueue: Queue<Subscription>,
  ) {}

  async sendConfirmationEmail(subscription: Subscription) {
    await this.mailQueue.add('sendConfirmationEmail', subscription, {
      attempts: 5,
    });
  }
}
