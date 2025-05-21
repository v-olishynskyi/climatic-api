import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../../constants';
import { MailFactory } from '../../../infrastructure/mail/factory/mail.factory';
import { MailService } from '../../../infrastructure/mail/services/mail.service';
import { MailWeatherQueueJobData } from '../weather.queue.types';

@Processor(QUEUE_NAMES.MAIL_WEATHER_HOURLY)
export class WeatherHourlyQueueProcessor extends WorkerHost {
  private mailFactory = new MailFactory();

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<MailWeatherQueueJobData>): Promise<any> {
    console.log('enqueueHourlyWeather process', job);
    await this.mailService.sendEmail(
      this.mailFactory.createWeatherUpdateMail(
        job.data.subscription,
        job.data.weather,
      ),
    );
  }
}
