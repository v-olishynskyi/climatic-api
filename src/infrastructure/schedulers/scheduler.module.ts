import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { WeatherService } from '../weather/services/weather.service';
import { MailService } from '../mail/services/mail.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  providers: [WeatherService, MailService],
})
export class SchedulerModule {}
