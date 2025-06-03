import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Subscription } from '../../../modules/subscription/entities/subsciption.entity';
import { randomUUID } from 'crypto';
import { FrequencyUpdatesEnum } from '../../../modules/subscription/enum';
import { generateSubscriptionToken } from '../../../shared/helpers';

const subsciption: Subscription = {
  id: randomUUID(),
  city: 'Kyiv',
  email: 'email@email.com',
  frequency: FrequencyUpdatesEnum.HOURLY,
  subscribed: false,
  subscription_token: generateSubscriptionToken('email@email.com'),
  unsubscribed_at: new Date(),
};

export default class SubscriptionsSeeder implements Seeder {
  /**
   * Track seeder execution.
   *
   * Default: false
   */
  track = false;

  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Subscription);

    await repository.insert([subsciption]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const subscriptionFactory = factoryManager.get(Subscription);
    // save 1 factory generated entity, to the database
    await subscriptionFactory.save();

    // save 5 factory generated entities, to the database
    await subscriptionFactory.saveMany(200);
  }
}
