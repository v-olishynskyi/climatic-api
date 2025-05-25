import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RmqEventsEnum } from '../enum';

@Controller()
export class RmqMailConfirmationQueueConsumer {
  @EventPattern(RmqEventsEnum.MAIL_CONFIRMATION)
  handleSentConfirmationMail(
    @Payload() email: string,
    @Payload() token: string,
  ) {
    console.log('Mail confirmation event received:', { email, token });
  }
}
