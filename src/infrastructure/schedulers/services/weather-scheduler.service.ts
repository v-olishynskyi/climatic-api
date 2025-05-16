import { Injectable, Logger } from '@nestjs/common';
import { WeatherService } from '../../weather/services/weather.service';
import { MailService } from '../../mail/services/mail.service';

@Injectable()
export class WeatherSchedulerService {
  private readonly logger = new Logger(WeatherSchedulerService.name);

  constructor(
    private readonly weatherService: WeatherService,
    private readonly mailService: MailService,
  ) {}

  // Define methods for scheduling weather-related tasks
  async scheduleWeatherUpdate(city: string, email: string) {
    const weather = await this.weatherService.getWeather(city);
    this.logger.log(`Weather data for ${city}: ${JSON.stringify(weather)}`);

    await this.mailService.sendEmail({
      // template: 'weather-update',
      to: email,
      subject: 'Weather updates',
      html: JSON.stringify(weather),
      // context: {
      //   weather,
      // },
    });
    this.logger.log(`Weather update sent to ${email}`);
  }
  // Logic to schedule weather updates
}

// Other methods related to weather scheduling can be added here
