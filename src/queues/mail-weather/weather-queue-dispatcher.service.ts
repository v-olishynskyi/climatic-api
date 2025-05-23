import { Injectable } from '@nestjs/common';
import { Subscription } from '../../modules/subscription/entities/subsciption.entity';
import { WeatherByCityDto } from '../../infrastructure/weather/dto/get-weather.dto';
import { FrequencyUpdatesEnum } from '../../modules/subscription/enum';
import { WeatherHourlyQueueService } from './weather-hourly.queue.service';
import { WeatherDailyQueueService } from './weather-daily.queue.service';

@Injectable()
export class WeatherQueueDispatcher {
  constructor(
    private readonly weatherHourlyQueueService: WeatherHourlyQueueService,
    private readonly weatherDailyQueueService: WeatherDailyQueueService,
  ) {}

  async dispatchWeatherUpdateEmail(
    subscription: Subscription,
    weather: WeatherByCityDto,
  ) {
    if (subscription.frequency === FrequencyUpdatesEnum.HOURLY) {
      await this.weatherHourlyQueueService.enqueueHourlyWeather(
        subscription,
        weather,
      );
    } else if (subscription.frequency === FrequencyUpdatesEnum.DAILY) {
      await this.weatherDailyQueueService.enqueueDailyWeather(
        subscription,
        weather,
      );
    }
  }
}
