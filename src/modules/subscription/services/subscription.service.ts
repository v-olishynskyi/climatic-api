import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SubscribeWeatherUpdatesDto } from '../dto';
import { WeatherService } from '../../../infrastructure/weather/services/weather.service';
import { MailService } from '../../../infrastructure/mail/services/mail.service';
import { CronService } from '../../../infrastructure/schedulers/services/cron.service';
import { JwtTokenService } from '../../../shared/services/jwt.service';
import { WeatherSchedulerService } from '../../../infrastructure/schedulers/services/weather-scheduler.service';

const tokens: Array<any> = [];

type JWTPayload = Record<string, unknown>;
@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    private readonly weatherService: WeatherService,
    private readonly mailService: MailService,
    private readonly cronService: CronService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly weatherScheduler: WeatherSchedulerService,
  ) {}

  async subscribeToWeatherUpdates(inputDto: SubscribeWeatherUpdatesDto) {
    // first we need to check if city is correct
    await this.weatherService.getWeather(inputDto.city);
    this.logger.log(`City is correct: ${inputDto.city}}`);

    const payload: JWTPayload = {
      sub: inputDto.email,
      city: inputDto.city,
      frequency: inputDto.frequency,
    };

    const token = await this.jwtTokenService.signAsync(payload, {
      expiresIn: '1h',
    });

    // send email with confirmation link
    await this.mailService.sendEmail({
      template: 'subscription-confirmation',
      to: inputDto.email,
      subject: 'Weather updates subscription confirmation',
      context: {
        city: inputDto.city,
        confirmUrl: `http://localhost:3000/confirm/${token}`,
        frequency: inputDto.frequency,
      },
    });

    this.logger.log(`Confirmation email sent to ${inputDto.email}`);

    // store the token on db
    tokens.push(token);
  }

  async confirmSubscription(token: string) {
    // check if token is exists in the db
    const tokenIndex = tokens.findIndex((t) => t === token);
    const isTokenExist = tokenIndex !== -1;

    if (!isTokenExist) {
      this.logger.error(`Token not found: ${token}`);
      throw new NotFoundException('Token not found');
    }

    try {
      // check if token is valid
      const tokenPayload =
        await this.jwtTokenService.verifyAsync<JWTPayload>(token);

      this.logger.log(`Token payload: ${JSON.stringify(tokenPayload)}`);

      this.cronService.createAndStartCronTask(
        token,
        () =>
          this.weatherScheduler.scheduleWeatherUpdate(
            tokenPayload.city as string,
            tokenPayload.sub as string,
          ),
        '30 * * * * *',
        // tokenPayload.frequency,
      );

      this.logger.log(`Cron job created for ${tokenPayload.sub as string}`);
    } catch (error) {
      this.logger.error(`Token verification error: ${error}`);
      // remove token from db
      tokens.splice(tokenIndex, 1);
      throw new ForbiddenException('Token is invalid');
    }
    // remove token from db
    tokens.splice(tokenIndex, 1);

    return 'Subscription confirmed successfully';
  }
}
