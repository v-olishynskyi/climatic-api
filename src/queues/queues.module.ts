import { Module } from '@nestjs/common';
import { WeatherDailyQueuesModule } from './mail-weather/weather-daily.queue.module';
import { MailConfirmationQueuesModule } from './mail-confirmation/mail-confirmation.queue.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import basicAuth from 'express-basic-auth';
import { WeatherHourlyQueuesModule } from './mail-weather/weather-hourly.queue.module';

@Module({
  imports: [
    WeatherDailyQueuesModule,
    WeatherHourlyQueuesModule,
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
