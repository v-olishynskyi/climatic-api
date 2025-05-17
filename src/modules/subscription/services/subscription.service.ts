import {
  BadRequestException,
  ForbiddenException,
  Injectable,
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
import { Repository } from 'typeorm';

type JWTPayload = Record<string, unknown>;
@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,

    private readonly weatherService: WeatherService,
    private readonly mailService: MailService,
    private readonly cronService: CronService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly weatherScheduler: WeatherSchedulerService,
  ) {}

  async subscribeToWeatherUpdates(inputDto: SubscribeWeatherUpdatesDto) {
    // first we need to check if city is correct
    const weatherCheckPromise = this.weatherService.getWeather(inputDto.city);

    const payload: JWTPayload = {
      sub: inputDto.email,
      city: inputDto.city,
      frequency: inputDto.frequency,
    };

    const [confirmSubscriptionToken, unsubscribeToken] = await Promise.all([
      // create a new token for confirmation
      // this token will be used to confirm the subscription
      this.jwtTokenService.signAsync(payload, { expiresIn: '1h' }),
      // create a new token for unsubscribe
      // this token will be used to unsubscribe from the weather updates
      this.jwtTokenService.signAsync(payload),
      // check if city is valid
      weatherCheckPromise,
    ]);

    try {
      // create a new subscription entity
      const subscription = this.subscriptionRepository.create({
        email: inputDto.email,
        city: inputDto.city,
        frequency: inputDto.frequency,
        subscribe_token: confirmSubscriptionToken,
        unsubscribe_token: unsubscribeToken,
      });

      // store the token on db
      const newSubscription =
        await this.subscriptionRepository.save(subscription);
      this.logger.log(
        `Subscription saved to db for email: ${newSubscription.email}, city: ${newSubscription.city}`,
        newSubscription,
      );
    } catch (error) {
      this.logger.error(`Error saving subscription to db: ${error}`);
      throw new ServiceUnavailableException('Error saving subscription to db');
    }

    try {
      // send email with confirmation link
      await this.mailService.sendEmail({
        template: 'subscription-confirmation',
        to: inputDto.email,
        subject: 'Weather updates subscription confirmation',
        context: {
          city: inputDto.city,
          confirmUrl: `http://localhost:3000/confirm/${confirmSubscriptionToken}`,
          frequency: inputDto.frequency,
        },
      });

      this.logger.log(`Confirmation email sent to ${inputDto.email}`);
    } catch (error) {
      this.logger.error(`Error sending email: ${error}`);
      throw new ServiceUnavailableException('Error sending email');
    }
  }

  async confirmSubscription(token: string) {
    // check if token is exists in the db
    const subscription = await this.subscriptionRepository.findOne({
      where: { subscribe_token: token },
    });

    if (!subscription || !subscription.subscribe_token) {
      this.logger.error(`Token not found: ${token}`);
      throw new NotFoundException('Token not found');
    }

    try {
      // check if token is valid
      await this.jwtTokenService.verifyAsync<JWTPayload>(
        subscription.subscribe_token,
      );
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        this.logger.error(`Token expired: ${subscription.subscribe_token}`);
        // remove the subscription from db because the token is expired
        await this.subscriptionRepository.delete(subscription.id);
        throw new ForbiddenException('Token expired');
      }

      this.logger.error('Invalid token', error);
      throw new BadRequestException('Invalid token');
    }

    this.cronService.createAndStartCronTask(
      token,
      () =>
        this.weatherScheduler.scheduleWeatherUpdate(
          subscription.city,
          subscription.email,
        ),
      '30 * * * * *',
      // subscription.frequency,
    );
    this.logger.log(`Cron job created and started for ${subscription.email}`);

    // update the subscription entity
    // mark the subscription as confirmed and remove the token
    await this.subscriptionRepository.update(subscription.id, {
      subscribe_token: null,
    });

    return 'Subscription confirmed successfully';
  }
}
