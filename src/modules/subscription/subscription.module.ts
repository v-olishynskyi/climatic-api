import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionController } from './controllers/subscription.controller';
import { WeatherService } from '../../infrastructure/weather/services/weather.service';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { CronService } from '../../infrastructure/schedulers/services/cron.service';
import { JwtTokenService } from '../../shared/services/jwt.service';
import { JwtTokenModule } from '../../shared/infrastructure/jwt.module';
import { WeatherSchedulerService } from '../../infrastructure/schedulers/services/weather-scheduler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subsciption.entity';
import { MailWeatherQueuesModule } from '../../queues/mail-weather/mail-weather.queue.module';
import { MailConfirmationQueuesModule } from '../../queues/mail-confirmation/mail-confirmation.queue.module';

@Module({
  imports: [
    HttpModule,
    JwtTokenModule,
    TypeOrmModule.forFeature([Subscription]),
    MailWeatherQueuesModule,
    MailConfirmationQueuesModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    WeatherService,
    MailService,
    CronService,
    JwtTokenService,
    WeatherSchedulerService,
  ],
})
export class SubscriptionModule {}
