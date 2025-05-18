import { ISendMailOptions } from '@nestjs-modules/mailer';
import { SubscribeWeatherUpdatesDto } from '../../../modules/subscription/dto';
import { generateSubscribeUrl } from '../../../shared/helpers/url.helper';
import { Subscription } from '../../../modules/subscription/entities/subsciption.entity';
import { GetWeatherByCityDto } from '../../weather/dto/get-weather.dto';

export class MailFactory {
  private readonly TEMPLATE = {
    SUBSCRIPTION_CONFIRMATION: 'subscription-confirmation',
    WEATHER_UPDATE: 'weather-update',
  };

  public createSubscriptionConfirmationMail(
    inputDto: SubscribeWeatherUpdatesDto,
    subscriptionToken: string,
  ): ISendMailOptions {
    return {
      template: this.TEMPLATE.SUBSCRIPTION_CONFIRMATION,
      to: inputDto.email,
      subject: 'Weather updates subscription confirmation',
      context: {
        city: inputDto.city,
        confirmUrl: generateSubscribeUrl(subscriptionToken),
        frequency: inputDto.frequency,
      },
    };
  }

  public createWeatherUpdateMail(
    subscription: Subscription,
    weather: GetWeatherByCityDto,
  ): ISendMailOptions {
    const unsubscribeUrl = generateSubscribeUrl(
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
