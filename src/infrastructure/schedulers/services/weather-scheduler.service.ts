import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { WeatherService } from '../../weather/services/weather.service';
import { MailService } from '../../mail/services/mail.service';
import { Subscription } from '../../../modules/subscription/entities/subsciption.entity';
import { MailFactory } from '../../mail/factory/mail.factory';
// import { generateUnsubscribeUrl } from '../../../shared/helpers/url.helper';

@Injectable()
export class WeatherSchedulerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(WeatherSchedulerService.name);
  private readonly mailFactory = new MailFactory();

  constructor(
    private readonly weatherService: WeatherService,
    private readonly mailService: MailService,
  ) {}

  async onApplicationBootstrap() {}

  async restoreScheduledSubscriptions() {
    // const subscriptionPromises = subscriptions.map((sub) => {
    //   const unsubscribeUrl = generateUnsubscribeUrl(sub.unsubscribe_token);
    //   return this.scheduleWeatherUpdate({
    //     city: sub.city,
    //     email: sub.email,
    //     unsubscribeUrl,
    //     frequency: sub.frequency,
    //   });
    // });
    // await Promise.all(subscriptionPromises);
  }

  // Define methods for scheduling weather-related tasks
  async scheduleWeatherUpdate(subsciption: Subscription) {
    const weather = await this.weatherService.getWeather(subsciption.city);

    await this.mailService.sendEmail(
      this.mailFactory.createWeatherUpdateMail(subsciption, weather),
    );
  }
}

// Other methods related to weather scheduling can be added here
