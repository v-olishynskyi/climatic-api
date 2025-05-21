import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../../constants';
import { Job } from 'bullmq';
import { MailService } from '../../../infrastructure/mail/services/mail.service';
import { MailFactory } from '../../../infrastructure/mail/factory/mail.factory';
import { MailWeatherQueueJobData } from '../weather.queue.types';

@Processor(QUEUE_NAMES.MAIL_WEATHER_DAILY)
export class WeatherDailyQueueProcessor extends WorkerHost {
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
