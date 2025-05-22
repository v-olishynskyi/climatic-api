import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUE_NAMES } from '../../constants';
import { MailWeatherQueueJobData } from '../weather.queue.types';
import { Subscription } from '../../../modules/subscription/entities/subsciption.entity';
import { WeatherByCityDto } from '../../../infrastructure/weather/dto/get-weather.dto';

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
        removeOnComplete: false,
      },
    );
  }
}
