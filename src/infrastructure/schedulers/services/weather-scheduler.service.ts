import { Injectable, Logger } from '@nestjs/common';
import { WeatherService } from '../../weather/services/weather.service';
import { Cron } from '@nestjs/schedule';
import { SubscriptionService } from '../../../modules/subscription/services/subscription.service';
import { FrequencyUpdatesEnum } from '../../../modules/subscription/enum';
import { WeatherByCityDto } from '../../weather/dto/get-weather.dto';
import { Subscription } from '../../../modules/subscription/entities/subsciption.entity';
import { WeatherQueueDispatcher } from '../../../queues/rabbitmq/weather-update-mail/weather-queue-dispatcher.service';

@Injectable()
export class WeatherSchedulerService {
  private readonly logger = new Logger(WeatherSchedulerService.name);

  constructor(
    private readonly weatherService: WeatherService,
    private readonly subscriptionService: SubscriptionService,
    private readonly weatherQueueDispatcher: WeatherQueueDispatcher,
  ) {}

  async getUsersByFrequenctWithCityWeather(
    frequency: FrequencyUpdatesEnum,
  ): Promise<{
    subscribedUsers: Subscription[];
    weatherByCity: Map<string, WeatherByCityDto>;
  }> {
    const subscribedUsers =
      await this.subscriptionService.getAllSubscriptionsByFrequency(frequency);

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
    if (
      !process.env.ENABLE_TEST_MODE ||
      process.env.ENABLE_TEST_MODE === 'false'
    ) {
      return;
    }

    const { subscribedUsers, weatherByCity } =
      await this.getUsersByFrequenctWithCityWeather(
        FrequencyUpdatesEnum.HOURLY,
      );

    subscribedUsers.forEach((subscription) => {
      const weather = weatherByCity.get(subscription.city);
      this.weatherQueueDispatcher.dispatchWeatherUpdateEmail(
        subscription,
        weather!,
      );
    });
  }

  @Cron('45 * * * * *')
  async DEV_ONLY__45secWeatherUpdateCronJob() {
    if (
      !process.env.ENABLE_TEST_MODE ||
      process.env.ENABLE_TEST_MODE === 'false'
    ) {
      return;
    }

    const { subscribedUsers, weatherByCity } =
      await this.getUsersByFrequenctWithCityWeather(FrequencyUpdatesEnum.DAILY);

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
      await this.getUsersByFrequenctWithCityWeather(
        FrequencyUpdatesEnum.HOURLY,
      );

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
      await this.getUsersByFrequenctWithCityWeather(FrequencyUpdatesEnum.DAILY);

    subscribedUsers.forEach((subscription) => {
      const weather = weatherByCity.get(subscription.city)!;
      this.weatherQueueDispatcher.dispatchWeatherUpdateEmail(
        subscription,
        weather,
      );
    });
  }
}
