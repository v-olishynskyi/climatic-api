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
import { WeatherModule } from '../../infrastructure/weather/weather.module';
import { RabbitMQModule } from '../../queues/rabbitmq/rabbitmq.module';
import { SubscriptionConfirmationMailService } from '../../queues/rabbitmq/subscription-confirmation-mail/subscription-confirmation-mail.service';

@Module({
  imports: [
    HttpModule,
    JwtTokenModule,
    TypeOrmModule.forFeature([Subscription]),
    RabbitMQModule,
    WeatherModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    WeatherService,
    MailService,
    CronService,
    JwtTokenService,
    SubscriptionService,
    SubscriptionConfirmationMailService,
  ],
  exports: [SubscriptionService, TypeOrmModule],
})
export class SubscriptionModule {}
