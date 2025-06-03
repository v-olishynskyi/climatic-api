import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Subscription } from '../../../modules/subscription/entities/subsciption.entity';
import { WeatherByCityDto } from '../../weather/dto/get-weather.dto';
import {
  generateConfirmUrl,
  generateUnsubscribeUrl,
} from '../../../shared/helpers';

export class MailFactory {
  private readonly TEMPLATE = {
    SUBSCRIPTION_CONFIRMATION: 'subscription-confirmation',
    WEATHER_UPDATE: 'weather-update',
  };

  public createSubscriptionConfirmationMail(
    subsciption: Subscription,
  ): ISendMailOptions {
    return {
      template: this.TEMPLATE.SUBSCRIPTION_CONFIRMATION,
      to: subsciption.email,
      subject: 'Weather updates subscription confirmation',
      context: {
        city: subsciption.city,
        confirmUrl: generateConfirmUrl(subsciption.subscription_token),
        frequency: subsciption.frequency,
      },
    };
  }

  public createWeatherUpdateMail(
    subscription: Subscription,
    weather: WeatherByCityDto,
  ): ISendMailOptions {
    const unsubscribeUrl = generateUnsubscribeUrl(
      subscription.subscription_token,
    );

    const context = {
      city: subscription.city,
      temperature: weather.temperature,
      description: weather.description,
      icon: `https:${weather.icon}`,
      frequency: subscription.frequency,
      unsubscribeUrl,
    };

    return {
      template: this.TEMPLATE.WEATHER_UPDATE,
      to: subscription.email,
      subject: `Оновлення погоди для міста ${subscription.city}`,
      context,
    };
  }
}
