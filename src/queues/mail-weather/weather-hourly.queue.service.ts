import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QUEUE_NAMES } from '../constants';
import { Queue } from 'bullmq';
import { Subscription } from '../../modules/subscription/entities/subsciption.entity';
import { MailWeatherQueueJobData } from './weather.queue.types';
import { WeatherByCityDto } from '../../infrastructure/weather/dto/get-weather.dto';

@Injectable()
export class WeatherHourlyQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.MAIL_WEATHER_HOURLY)
    private readonly mailQueue: Queue<MailWeatherQueueJobData>,
  ) {}

  async enqueueHourlyWeather(
    subscription: Subscription,
    weather: WeatherByCityDto,
  ) {
    await this.mailQueue.add(
      'sendHourlyWeatherUpdate',
      { subscription, weather },
      {
        attempts: 5,
      },
    );
  }
}
