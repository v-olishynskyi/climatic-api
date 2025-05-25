import { ClientNames, QueueEventsEnum } from '../enum';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Subscription } from '../../../modules/subscription/entities/subsciption.entity';

@Injectable()
export class SubscriptionConfirmationMailService {
  constructor(
    @Inject(ClientNames.SUBSCRIPTION_CONFIRMATION_MAIL)
    private readonly client: ClientProxy,
  ) {}

  async sendSubscriptionConfirmationMail(data: Subscription): Promise<void> {
    await firstValueFrom(
      this.client.emit(QueueEventsEnum.SUBSCRIPTION_CONFIRMATION_MAIL, data),
    );
  }
}
