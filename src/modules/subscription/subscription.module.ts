import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionController } from './controllers/subscription.controller';
import { WeatherService } from '../../infrastructure/weather/services/weather.service';
import { MailService } from '../../infrastructure/mail/services/mail.service';
import { CronService } from '../../infrastructure/schedulers/services/cron.service';
import { JwtTokenService } from '../../shared/services/jwt.service';
import { JwtTokenModule } from '../../shared/infrastructure/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subsciption.entity';
import { MailConfirmationQueuesModule } from '../../queues/mail-confirmation/mail-confirmation.queue.module';
import { WeatherModule } from '../../infrastructure/weather/weather.module';

@Module({
  imports: [
    HttpModule,
    JwtTokenModule,
    TypeOrmModule.forFeature([Subscription]),
    MailConfirmationQueuesModule,
    WeatherModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    WeatherService,
    MailService,
    CronService,
    JwtTokenService,
    SubscriptionService,
  ],
  exports: [SubscriptionService, TypeOrmModule],
})
export class SubscriptionModule {}
