import { SubscribeWeatherUpdatesDto } from '../dto';
import { Subscription } from '../entities/subsciption.entity';
import { DeepPartial } from 'typeorm';
import { generateSubscriptionToken } from '../../../shared/helpers';

export class SubscriptionFactory {
  static createSubscription(
    inputDto: SubscribeWeatherUpdatesDto,
  ): DeepPartial<Subscription> {
    const subscriptionToken = generateSubscriptionToken(inputDto.email);

    return {
      email: inputDto.email,
      city: inputDto.city,
      frequency: inputDto.frequency,
      subscription_token: subscriptionToken,
      subscribed: false,
    };
  }
}
