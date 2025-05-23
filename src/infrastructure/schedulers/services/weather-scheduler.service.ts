import { Injectable, Logger } from '@nestjs/common';
import { WeatherService } from '../../weather/services/weather.service';
import { Cron } from '@nestjs/schedule';
import { SubscriptionService } from '../../../modules/subscription/services/subscription.service';
import { FrequencyUpdatesEnum } from '../../../modules/subscription/enum';
import { WeatherByCityDto } from '../../weather/dto/get-weather.dto';
import { WeatherQueueDispatcher } from '../../../queues/mail-weather/weather-queue-dispatcher.service';
import { Subscription } from '../../../modules/subscription/entities/subsciption.entity';

@Injectable()
export class WeatherSchedulerService {
  private readonly logger = new Logger(WeatherSchedulerService.name);

  constructor(
    private readonly weatherService: WeatherService,
    private readonly weatherQueueDispatcher: WeatherQueueDispatcher,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async getUsersByFrequenctWithCityWeather(): Promise<{
    subscribedUsers: Subscription[];
    weatherByCity: Map<string, WeatherByCityDto>;
  }> {
    const subscribedUsers =
      await this.subscriptionService.getAllSubscriptionsByFrequency(
        FrequencyUpdatesEnum.HOURLY,
      );

    const uniqueCities = [...new Set(subscribedUsers.map((user) => user.city))];

    const weathersData = await Promise.all(
      uniqueCities.map((city) => this.weatherService.getWeather(city)),
    );

    const weatherByCity = new Map<string, WeatherByCityDto>();
    uniqueCities.forEach((city, index) => {
      weatherByCity.set(city, weathersData[index]);
    });

    return { subscribedUsers, weatherByCity };
  }

  @Cron('30 * * * * *')
  async DEV_ONLY__30secWeatherUpdateCronJob() {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const { subscribedUsers, weatherByCity } =
      await this.getUsersByFrequenctWithCityWeather();

    subscribedUsers.forEach((subscription) => {
      const weather = weatherByCity.get(subscription.city);
      this.weatherQueueDispatcher.dispatchWeatherUpdateEmail(
        subscription,
        weather!,
      );
    });
  }

  @Cron('0 0 * * * *')
  async hourlyWeatherUpdateCronJob() {
    const { subscribedUsers, weatherByCity } =
      await this.getUsersByFrequenctWithCityWeather();

    subscribedUsers.forEach((subscription) => {
      const weather = weatherByCity.get(subscription.city);
      this.weatherQueueDispatcher.dispatchWeatherUpdateEmail(
        subscription,
        weather!,
      );
    });
  }

  @Cron('0 07 * * *')
  async dailyWeatherUpdateCronJob() {
    const { subscribedUsers, weatherByCity } =
      await this.getUsersByFrequenctWithCityWeather();

    subscribedUsers.forEach((subscription) => {
      const weather = weatherByCity.get(subscription.city)!;
      this.weatherQueueDispatcher.dispatchWeatherUpdateEmail(
        subscription,
        weather,
      );
    });
  }
}
