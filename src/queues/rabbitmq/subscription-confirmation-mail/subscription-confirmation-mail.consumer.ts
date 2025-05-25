import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { QueueEventsEnum } from '../enum';
import { MailService } from '../../../infrastructure/mail/services/mail.service';
import { MailFactory } from '../../../infrastructure/mail/factory/mail.factory';
import { Subscription } from '../../../modules/subscription/entities/subsciption.entity';

@Controller()
export class SubscriptionConfirmationMailConsumer {
  private readonly mailFactory = new MailFactory();

  constructor(private readonly mailService: MailService) {}

  @EventPattern(QueueEventsEnum.SUBSCRIPTION_CONFIRMATION_MAIL)
  async handleSubscriptionConfirmationMail(@Payload() data: Subscription) {
    await this.mailService.sendEmail(
      this.mailFactory.createSubscriptionConfirmationMail(data),
    );
  }
}
