import { Injectable } from '@nestjs/common';
import { SubscribeWeatherUpdatesDto } from '../dto';
import { WeatherService } from '../../../infrastructure/weather/services/weather.service';
import { MailService } from '../../../infrastructure/mail/services/mail.service';
import { CronService } from '../../../infrastructure/schedulers/services/cron.service';
import { JwtTokenService } from '../../../shared/services/jwt.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly mailService: MailService,
    private readonly cronService: CronService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async subscribeToWeatherUpdates(inputDto: SubscribeWeatherUpdatesDto) {
    // first we need to check if city is correct
    await this.weatherService.getWeather(inputDto.city);

    const payload = {
      sub: inputDto.email,
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

    // store the token on db
  }

  confirmSubscription(token: string) {
    this.cronService.createCronTask(
      token,
      () => {
        console.log('asdasdasdaa');
      },
      '5 * * * *',
    );

    return 'Subscription confirmed successfully';
  }
}
