import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../constants';
import { Job } from 'bullmq';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { MailFactory } from '../../infrastructure/mail/factory/mail.factory';
import { WeatherService } from '../../infrastructure/weather/services/weather.service';
import { Subscription } from '../../modules/subscription/entities/subsciption.entity';

@Processor(QUEUE_NAMES.MAIL)
export class MailQueueProcessor extends WorkerHost {
  private mailFactory = new MailFactory();

  constructor(
    private readonly mailService: MailService,
    private readonly weatherService: WeatherService,
  ) {
    super();
  }

  async process(job: Job<Subscription>): Promise<any> {
    const weather = await this.weatherService.getWeather(job.data.city);

    await this.mailService.sendEmail(
      this.mailFactory.createWeatherUpdateMail(job.data, weather),
    );
  }
}
