import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QueueNamesEnum } from '../../enum';
import { Queue } from 'bullmq';
import { Subscription } from '../../../modules/subscription/entities/subsciption.entity';
import { MailWeatherQueueJobData } from '../weather.queue.types';
import { WeatherByCityDto } from '../../../infrastructure/weather/dto/get-weather.dto';

@Injectable()
export class WeatherDailyQueueService {
  constructor(
    @InjectQueue(QueueNamesEnum.MAIL_WEATHER_DAILY)
    private readonly mailQueue: Queue<MailWeatherQueueJobData>,
  ) {}

  async enqueueDailyWeather(
    subscription: Subscription,
    weather: WeatherByCityDto,
  ) {
    await this.mailQueue.add(
      'sendDailyWeatherUpdate',
      { subscription, weather },
      {
        attempts: 5,
        removeOnComplete: false,
      },
    );
  }
}
