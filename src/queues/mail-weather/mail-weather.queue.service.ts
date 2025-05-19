import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QUEUE_NAMES } from '../constants';
import { Queue } from 'bullmq';
import { Subscription } from '../../modules/subscription/entities/subsciption.entity';
import { MailWeatherQueueJobData } from './mail-weather.queue.types';
import { WeatherByCityDto } from '../../infrastructure/weather/dto/get-weather.dto';

@Injectable()
export class MailWeatherQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.MAIL_WEATHER)
    private readonly mailQueue: Queue<MailWeatherQueueJobData>,
  ) {}

  async sendWeatherUpdateEmail(
    subscription: Subscription,
    weather: WeatherByCityDto,
  ) {
    await this.mailQueue.add(
      'sendWeatherUpdate',
      { subscription, weather },
      {
        attempts: 5,
      },
    );
  }
}
