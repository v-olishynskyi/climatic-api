import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { WeatherService } from '../../weather/services/weather.service';
import { MailService } from '../../mail/services/mail.service';
import { FrequencyUpdatesEnum } from '../../../modules/subscription/enum';
import { Subscription } from '../../../modules/subscription/entities/subsciption.entity';
import { generateUnsubscribeUrl } from '../../../shared/helpers/url.helper';

@Injectable()
export class WeatherSchedulerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(WeatherSchedulerService.name);

  constructor(
    private readonly weatherService: WeatherService,
    private readonly mailService: MailService,
  ) {}

  async onApplicationBootstrap() {}

  async restoreScheduledSubscriptions(subscriptions: Array<Subscription>) {
    const subscriptionPromises = subscriptions.map((sub) => {
      const unsubscribeUrl = generateUnsubscribeUrl(sub.unsubscribe_token);

      return this.scheduleWeatherUpdate({
        city: sub.city,
        email: sub.email,
        unsubscribeUrl,
        frequency: sub.frequency,
      });
    });

    await Promise.all(subscriptionPromises);
  }

  // Define methods for scheduling weather-related tasks
  async scheduleWeatherUpdate(options: {
    city: string;
    email: string;
    unsubscribeUrl: string;
    frequency: FrequencyUpdatesEnum;
  }) {
    const { city, email, unsubscribeUrl, frequency } = options;

    const weather = await this.weatherService.getWeather(city);
    this.logger.log(`Weather data for ${city}: ${JSON.stringify(weather)}`);

    const context = {
      city,
      temperature: weather.temperature,
      description: weather.description,
      icon: `https:${weather.icon}`,
      frequency, // або 'hourly'
      unsubscribeUrl,
    };

    await this.mailService.sendEmail({
      template: 'weather-update',
      to: email,
      subject: `Оновлення погоди для міста ${city}`,
      context,
    });
    this.logger.log(`Weather update sent to ${email}`);
  }
  // Logic to schedule weather updates
}

// Other methods related to weather scheduling can be added here
