import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { QueueEventsEnum } from '../../enum';
import { WeatherUpdateMailData } from '../../queue.types';
import { MailService } from '../../../../infrastructure/mail/services/mail.service';
import { MailFactory } from '../../../../infrastructure/mail/factory/mail.factory';

@Controller()
export class WeatherUpdateDailyMailConsumer {
  private readonly mailFactory = new MailFactory();

  constructor(private readonly mailService: MailService) {}

  @EventPattern(QueueEventsEnum.WEATHER_UPDATE_DAILY_MAIL)
  async handleUpdateWeatherDailyMail(data: WeatherUpdateMailData) {
    await this.mailService.sendEmail(
      this.mailFactory.createWeatherUpdateMail(data.subscription, data.weather),
    );
  }
}
