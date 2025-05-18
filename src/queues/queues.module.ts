import { Module } from '@nestjs/common';
import { MailQueuesModule } from './mail/mail.queue.module';

@Module({
  imports: [MailQueuesModule],
})
export class QueuesModule {}
