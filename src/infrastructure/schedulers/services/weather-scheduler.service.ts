import { Injectable, Logger } from '@nestjs/common';
import { WeatherService } from '../../weather/services/weather.service';
import { Cron } from '@nestjs/schedule';
import { SubscriptionService } from '../../../modules/subscription/services/subscription.service';
import { FrequencyUpdatesEnum } from '../../../modules/subscription/enum';
import { WeatherDailyQueueService } from '../../../queues/mail-weather/weather-daily.queue.service';
import { WeatherHourlyQueueService } from '../../../queues/mail-weather/weather-hourly.queue.service';
import { WeatherByCityDto } from '../../weather/dto/get-weather.dto';

@Injectable()
export class WeatherSchedulerService {
  private readonly logger = new Logger(WeatherSchedulerService.name);

  constructor(
    private readonly weatherService: WeatherService,
    private readonly weatherDailyQueueService: WeatherDailyQueueService,
    private readonly weatherHourlyQueueService: WeatherHourlyQueueService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Cron('30 * * * * *')
  async test__30secWeatherUpdateCronJob() {
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

    subscribedUsers.forEach((subscription) => {
      const weather = weatherByCity.get(subscription.city);
      this.weatherHourlyQueueService.sendWeatherUpdateEmail(
        subscription,
        weather!,
      );
    });
  }

  @Cron('0 0 * * * *')
  async hourlyWeatherUpdateCronJob() {
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

    subscribedUsers.forEach((subscription) => {
      const weather = weatherByCity.get(subscription.city);
      this.weatherHourlyQueueService.sendWeatherUpdateEmail(
        subscription,
        weather!,
      );
    });
  }

  @Cron('0 07 * * *')
  async dailyWeatherUpdateCronJob() {
    const subscribedUsers =
      await this.subscriptionService.getAllSubscriptionsByFrequency(
        FrequencyUpdatesEnum.DAILY,
      );

    const uniqueCities = [...new Set(subscribedUsers.map((user) => user.city))];

    const weathersData = await Promise.all(
      uniqueCities.map((city) => this.weatherService.getWeather(city)),
    );

    const weatherByCity = new Map<string, WeatherByCityDto>();
    uniqueCities.forEach((city, index) => {
      weatherByCity.set(city, weathersData[index]);
    });

    subscribedUsers.forEach((subscription) => {
      const weather = weatherByCity.get(subscription.city)!;
      this.weatherDailyQueueService.sendWeatherUpdateEmail(
        subscription,
        weather,
      );
    });
  }
}
