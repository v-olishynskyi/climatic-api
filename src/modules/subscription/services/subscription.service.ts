import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SubscribeWeatherUpdatesDto } from '../dto';
import { WeatherService } from '../../../infrastructure/weather/services/weather.service';
import { MailService } from '../../../infrastructure/mail/services/mail.service';
import { CronService } from '../../../infrastructure/schedulers/services/cron.service';
import { JwtTokenService } from '../../../shared/services/jwt.service';
import { WeatherSchedulerService } from '../../../infrastructure/schedulers/services/weather-scheduler.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from '../entities/subsciption.entity';
import { DataSource, Repository } from 'typeorm';
import { createHash } from 'node:crypto';
import { MailFactory } from '../../../infrastructure/mail/factory/mail.factory';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);
  private readonly mailFactory = new MailFactory();

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,

    private readonly weatherService: WeatherService,
    private readonly mailService: MailService,
    private readonly cronService: CronService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly weatherScheduler: WeatherSchedulerService,
    private readonly dataSource: DataSource,
  ) {}

  async subscribeToWeatherUpdates(inputDto: SubscribeWeatherUpdatesDto) {
    // first we need to check if city is correct
    await this.weatherService.getWeather(inputDto.city);

    // generate token for subscription
    const payloadString = `${inputDto.email}${new Date().getTime()}`;
    const hash = createHash('sha256');
    const subscriptionToken = hash.update(payloadString).digest('hex');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // create a new subscription entity
      const subscription = queryRunner.manager.create(Subscription, {
        email: inputDto.email,
        city: inputDto.city,
        frequency: inputDto.frequency,
        subscription_token: subscriptionToken,
      });

      // store the token on db
      await queryRunner.manager.save(subscription);

      try {
        // send email with confirmation link
        await this.mailService.sendEmail(
          this.mailFactory.createSubscriptionConfirmationMail(
            inputDto,
            subscriptionToken,
          ),
        );

        await queryRunner.commitTransaction();

        this.logger.log(`Confirmation email sent to ${inputDto.email}`);
      } catch (emailError) {
        this.logger.error(`Error sending email: ${emailError}`);
        await queryRunner.rollbackTransaction();
        throw new ServiceUnavailableException('Error sending email');
      }
    } catch (dbError) {
      this.logger.error(`Error saving subscription to db: ${dbError}`);
      await queryRunner.rollbackTransaction();
      throw new ServiceUnavailableException('Error saving subscription to db');
    } finally {
      await queryRunner.release();
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

    // stop the cron job for this subscription
    await this.cronService.stopCronTask(subscription.id);

    return 'Subscription removed successfully';
  }
}
