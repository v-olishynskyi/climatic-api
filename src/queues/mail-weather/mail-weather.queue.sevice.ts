import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QUEUE_NAMES } from '../constants';
import { Queue } from 'bullmq';
import { Subscription } from '../../modules/subscription/entities/subsciption.entity';

@Injectable()
export class MailWeatherQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.MAIL_WEATHER)
    private readonly mailQueue: Queue<Subscription>,
  ) {}

  async sendEmail(subscription: Subscription) {
    await this.mailQueue.add('sendWeatherUpdate', subscription, {
      attempts: 5,
    });
  }
}
