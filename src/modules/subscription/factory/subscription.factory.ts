import { createHash } from 'crypto';
import { SubscribeWeatherUpdatesDto } from '../dto';
import { Subscription } from '../entities/subsciption.entity';
import { DeepPartial } from 'typeorm';

export class SubscriptionFactory {
  static createSubscription(
    inputDto: SubscribeWeatherUpdatesDto,
  ): DeepPartial<Subscription> {
    // generate token for subscription
    const payloadString = `${inputDto.email}${new Date().getTime()}`;
    const hash = createHash('sha256');
    const subscriptionToken = hash.update(payloadString).digest('hex');

    return {
      email: inputDto.email,
      city: inputDto.city,
      frequency: inputDto.frequency,
      subscription_token: subscriptionToken,
      subscribed: false,
    };
  }
}
