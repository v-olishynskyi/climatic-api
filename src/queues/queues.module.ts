import { Module } from '@nestjs/common';
import { MailWeatherQueuesModule } from './mail-weather/mail-weather.queue.module';
import { MailConfirmationQueuesModule } from './mail-confirmation/mail-confirmation.queue.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import basicAuth from 'express-basic-auth';

@Module({
  imports: [
    MailWeatherQueuesModule,
    MailConfirmationQueuesModule,
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter, // Or FastifyAdapter from `@bull-board/fastify`
      middleware: basicAuth({
        challenge: true,
        users: { admin: String(process.env.BULL_BOARD_PASSWORD) },
      }),
    }),
  ],
})
export class QueuesModule {}
