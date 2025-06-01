import { ClientNames, QueueEventsEnum } from '../enum';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Subscription } from '../../../modules/subscription/entities/subsciption.entity';
import RabbitMQFactory from '../factory/rabbitmq.factory';

@Injectable()
export class SubscriptionConfirmationMailService {
  constructor(
    @Inject(
      RabbitMQFactory.resolveClientName(
        ClientNames.SUBSCRIPTION_CONFIRMATION_MAIL,
      ),
    )
    private readonly client: ClientProxy,
  ) {}

  async sendSubscriptionConfirmationMail(data: Subscription): Promise<void> {
    await firstValueFrom(
      this.client.emit(QueueEventsEnum.SUBSCRIPTION_CONFIRMATION_MAIL, data),
    );
  }
}
