/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { setSeederFactory } from 'typeorm-extension';
import { Subscription } from '../../../modules/subscription/entities/subsciption.entity';
import { FrequencyUpdatesEnum } from '../../../modules/subscription/enum';
import { generateSubscriptionToken } from '../../../shared/helpers';
import cities from '../../../mocks/cities';

export default setSeederFactory(Subscription, (faker) => {
  const subscription = new Subscription();

  const email = faker.internet.email();
  const randNum = faker.number.int({ min: 0, max: 371 });
  const isSubscribed = faker.datatype.boolean({ probability: 0.75 });

  subscription.email = email;
  subscription.city = cities[randNum].name;
  subscription.frequency = faker.helpers.arrayElement([
    FrequencyUpdatesEnum.DAILY,
    FrequencyUpdatesEnum.HOURLY,
  ]);
  subscription.subscribed = isSubscribed;
  subscription.subscription_token = generateSubscriptionToken(email);
  if (!isSubscribed) {
    subscription.unsubscribed_at = faker.date.recent();
  }

  return subscription;
});
