import { Injectable } from '@nestjs/common';
import { WeatherUpdateHourlyMailService } from './hourly/weather-update-hourly-mail.service';
import { WeatherUpdateDailyMailService } from './daily/weather-update-daily-mail.service';
import { Subscription } from '../../../modules/subscription/entities/subsciption.entity';
import { WeatherByCityDto } from '../../../infrastructure/weather/dto/get-weather.dto';
import { FrequencyUpdatesEnum } from '../../../modules/subscription/enum';
import { WeatherUpdateMailData } from '../queue.types';

@Injectable()
export class WeatherQueueDispatcher {
  constructor(
    private readonly weatherUpdateHourlyMailService: WeatherUpdateHourlyMailService,
    private readonly weatherUpdateDailyMailService: WeatherUpdateDailyMailService,
  ) {}

  async dispatchWeatherUpdateEmail(
    subscription: Subscription,
    weather: WeatherByCityDto,
  ): Promise<void> {
    const data: WeatherUpdateMailData = { subscription, weather };

    if (subscription.frequency === FrequencyUpdatesEnum.HOURLY) {
      await this.weatherUpdateHourlyMailService.sendWeatherUpdateMail(data);
    } else if (subscription.frequency === FrequencyUpdatesEnum.DAILY) {
      await this.weatherUpdateDailyMailService.sendWeatherUpdateMail(data);
    }
  }
}
