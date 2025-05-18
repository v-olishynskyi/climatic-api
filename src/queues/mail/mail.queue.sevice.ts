import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QUEUE_NAMES } from '../constants';
import { Queue } from 'bullmq';
import { Subscription } from '../../modules/subscription/entities/subsciption.entity';

@Injectable()
export class MailQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.MAIL)
    private readonly mailQueue: Queue<Subscription>,
  ) {}

  async sendEmail(subscription: Subscription) {
    const newJob = await this.mailQueue.add(
      'sendConfirmationEmail',
      subscription,
      {
        attempts: 5,
      },
    );

    console.log(newJob);
  }
}
