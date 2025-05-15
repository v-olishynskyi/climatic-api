import { Module } from '@nestjs/common';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './controllers/weather.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
