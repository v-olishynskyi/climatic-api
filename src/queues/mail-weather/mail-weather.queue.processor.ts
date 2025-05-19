import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../constants';
import { Job } from 'bullmq';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { MailFactory } from '../../infrastructure/mail/factory/mail.factory';
import { MailWeatherQueueJobData } from './mail-weather.queue.types';

@Processor(QUEUE_NAMES.MAIL_WEATHER)
export class MailWeatherQueueProcessor extends WorkerHost {
  private mailFactory = new MailFactory();

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<MailWeatherQueueJobData>): Promise<any> {
    await this.mailService.sendEmail(
      this.mailFactory.createWeatherUpdateMail(
        job.data.subscription,
        job.data.weather,
      ),
    );
  }
}
