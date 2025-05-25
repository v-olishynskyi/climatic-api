import { Inject, Injectable } from '@nestjs/common';
import { RmqEventsEnum, RmqQueueClientsNamesEnum } from '../enum';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RmqMailConfirmationQueueService {
  constructor(
    @Inject(RmqQueueClientsNamesEnum.MAIL_CONFIRMATION)
    private readonly client: ClientProxy,
  ) {}

  async enqueueMailConfirmation(email: string, token: string): Promise<void> {
    await firstValueFrom(
      this.client.emit(RmqEventsEnum.MAIL_CONFIRMATION, { email, token }),
    );
  }
}
