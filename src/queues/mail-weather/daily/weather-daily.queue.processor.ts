import { QueueNamesEnum } from '../../enum';
import { Job, Worker } from 'bullmq';
import { MailService } from '../../../infrastructure/mail/services/mail.service';
import { MailFactory } from '../../../infrastructure/mail/factory/mail.factory';
import { MailWeatherQueueJobData } from '../weather.queue.types';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { AppConfigService } from '../../../config/shared-config.service';
import { RedisFactory } from '../../../redis/factory/redis.factory';

@Injectable()
export class WeatherDailyQueueProcessor implements OnModuleInit {
  private mailFactory = new MailFactory();

  constructor(
    private readonly mailService: MailService,
    private readonly configService: AppConfigService,
  ) {}

  onModuleInit() {
    const connection = RedisFactory.createRedisConfig(this.configService);

    new Worker(
      QueueNamesEnum.MAIL_WEATHER_DAILY,
      async (job: Job<MailWeatherQueueJobData>) => {
        await this.mailService.sendEmail(
          this.mailFactory.createWeatherUpdateMail(
            job.data.subscription,
            job.data.weather,
          ),
        );
      },
      {
        connection,
        autorun: true,
        prefix: QueueNamesEnum.MAIL_WEATHER_DAILY,
      },
    );
  }
}
