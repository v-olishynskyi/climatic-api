import { Module } from '@nestjs/common';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionController } from './controllers/subscription.controller';
import { WeatherService } from '../../infrastructure/weather/services/weather.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, WeatherService],
})
export class SubscriptionModule {}
