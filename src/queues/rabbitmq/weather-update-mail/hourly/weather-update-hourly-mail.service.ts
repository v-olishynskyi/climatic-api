import { ClientNames, QueueEventsEnum } from '../../enum';
import { ClientProxy } from '@nestjs/microservices';
import { WeatherUpdateMailData } from '../../queue.types';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import RabbitMQFactory from '../../factory/rabbitmq.factory';

@Injectable()
export class WeatherUpdateHourlyMailService {
  constructor(
    @Inject(
      RabbitMQFactory.resolveClientName(ClientNames.WEATHER_UPDATE_HOURLY_MAIL),
    )
    private readonly client: ClientProxy,
  ) {}

  async sendWeatherUpdateMail(data: WeatherUpdateMailData): Promise<void> {
    await firstValueFrom(
      this.client.emit(QueueEventsEnum.WEATHER_UPDATE_HOURLY_MAIL, data),
    );
  }
}
