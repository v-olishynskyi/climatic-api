import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SubscribeWeatherUpdatesDto } from '../dto';
import { WeatherService } from '../../../infrastructure/weather/services/weather.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from '../entities/subsciption.entity';
import { Repository } from 'typeorm';
import { SubscriptionFactory } from '../factory/subscription.factory';
import { MailConfirmationQueueService } from '../../../queues/mail-confirmation/mail-confirmation.queue.sevice';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly weatherService: WeatherService,
    private readonly mailConfirmationQueueService: MailConfirmationQueueService,
  ) {}

  async subscribeToWeatherUpdates(inputDto: SubscribeWeatherUpdatesDto) {
    // first we need to check if city is correct
    await this.weatherService.getWeather(inputDto.city);

    // create a new subscription entity
    const subscription = this.subscriptionRepository.create(
      SubscriptionFactory.createSubscription(inputDto),
    );

    try {
      // store the token on db
      await this.subscriptionRepository.save(subscription);

      // send email with confirmation link
      this.mailConfirmationQueueService.sendConfirmationEmail(subscription);
    } catch (error) {
      this.logger.error(`Error creating subscription: ${error}`);
      throw new InternalServerErrorException(
        `Error creating subscription. Try again ${error}`,
      );
    }
  }

  async confirmSubscription(token: string) {
    // check if token is exists in the db
    const subscription = await this.subscriptionRepository.findOne({
      where: { subscription_token: token },
    });

    if (!subscription || !subscription.subscription_token) {
      this.logger.error(`Token not found: ${token}`);
      throw new NotFoundException('Token not found');
    }

    // first we need to update the subscription entity
    // mark the subscription as "confirmed" by removing the token
    try {
      await this.subscriptionRepository.update(subscription.id, {
        subscribed: true,
      });
    } catch (error) {
      this.logger.error(`Error updating subscription: ${error}`);
      throw new InternalServerErrorException(
        'Error updating subscription. Try again',
      );
    }

    return 'Subscription confirmed successfully';
  }

  async unsubscribeFromWeatherUpdates(unsubscribeToken: string) {
    // check if token is exists in the db
    const subscription = await this.subscriptionRepository.findOne({
      where: { subscription_token: unsubscribeToken },
    });

    if (!subscription) {
      this.logger.error(`Subscription not found`);
      throw new NotFoundException('Subscription not found');
    }

    try {
      // remove the subscription from db
      await this.subscriptionRepository.update(subscription.id, {
        subscribed: false,
        unsubscribed_at: new Date(),
      });
    } catch (error) {
      this.logger.error(`Error deleting subscription: ${error}`);
      throw new InternalServerErrorException(
        'Error deleting subscription. Try again',
      );
    }

    return 'Subscription removed successfully';
  }
}
