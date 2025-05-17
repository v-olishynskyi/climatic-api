import { Injectable, Logger } from '@nestjs/common';
import { WeatherService } from '../../weather/services/weather.service';
import { MailService } from '../../mail/services/mail.service';
import { FrequencyUpdatesEnum } from '../../../modules/subscription/enum';

@Injectable()
export class WeatherSchedulerService {
  private readonly logger = new Logger(WeatherSchedulerService.name);

  constructor(
    private readonly weatherService: WeatherService,
    private readonly mailService: MailService,
  ) {}

  // Define methods for scheduling weather-related tasks
  async scheduleWeatherUpdate(
    city: string,
    email: string,
    unsubscribeUrl: string,
    frequency: FrequencyUpdatesEnum,
  ) {
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
