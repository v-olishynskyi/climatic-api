import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WeatherModule } from './infrastructure/weather/weather.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { SchedulerModule } from './infrastructure/schedulers/scheduler.module';
import configurations from './config';
import { JwtTokenModule } from './shared/infrastructure/jwt.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { QueuesModule } from './queues/queues.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configurations,
    }),
    RedisModule,
    QueuesModule,
    DatabaseModule,
    JwtTokenModule,
    SchedulerModule,
    MailModule,
    WeatherModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
