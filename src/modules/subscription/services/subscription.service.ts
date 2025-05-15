import { Injectable } from '@nestjs/common';
import { SubscribeWeatherUpdatesDto } from '../dto';
import { WeatherService } from '../../../infrastructure/weather/services/weather.service';
import { MailService } from '../../../infrastructure/mail/services/mail.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly mailService: MailService,
  ) {}

  async subscribeToWeatherUpdates(inputDto: SubscribeWeatherUpdatesDto) {
    // first we need to check if city is correct
    await this.weatherService.getWeather(inputDto.city);

    const token = 'lorem-ipsum-token'; // TODO: generate token

    await this.mailService.sendEmail({
      template: 'subscription-confirmation',
      to: inputDto.email,
      subject: 'Weather updates subscription confirmation',
      context: {
        city: inputDto.city,
        confirmUrl: `http://localhost:3000/confirm/${token}`,
      },
    });
  }
}
