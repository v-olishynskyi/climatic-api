import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './infrastructure/weather/weather.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { SchedulerModule } from './infrastructure/schedulers/scheduler.module';
import configurations from './config/configurations';
import { JwtTokenModule } from './shared/modules/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
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
