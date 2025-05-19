import { Module } from '@nestjs/common';
import { MailWeatherQueuesModule } from './mail-weather/mail-weather.queue.module';
import { MailConfirmationQueuesModule } from './mail-confirmation/mail-confirmation.queue.module';

@Module({
  imports: [MailWeatherQueuesModule, MailConfirmationQueuesModule],
})
export class QueuesModule {}
