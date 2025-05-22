import { QueueNamesEnum } from '../enum';
import { Job, Worker } from 'bullmq';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { MailFactory } from '../../infrastructure/mail/factory/mail.factory';
import { Subscription } from '../../modules/subscription/entities/subsciption.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { AppConfigService } from '../../config/shared-config.service';
import { RedisFactory } from '../../redis/factory/redis.factory';

@Injectable()
export class MailQueueProcessor implements OnModuleInit {
  private mailFactory = new MailFactory();

  constructor(
    private readonly mailService: MailService,
    private readonly configService: AppConfigService,
  ) {}

  onModuleInit() {
    const connection = RedisFactory.createRedisConfig(this.configService);

    new Worker(
      QueueNamesEnum.MAIL_CONFIRMATION,
      async (job: Job<Subscription>) => {
        await this.mailService.sendEmail(
          this.mailFactory.createSubscriptionConfirmationMail(job.data),
        );
      },
      {
        connection,
        autorun: true,
        prefix: QueueNamesEnum.MAIL_CONFIRMATION,
      },
    );
  }
}
