import { Module } from '@nestjs/common';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './controllers/weather.controller';
import { HttpModule } from '@nestjs/axios';
import { WeatherCacheService } from './services/weather.cache.service';

@Module({
  imports: [HttpModule],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherCacheService],
  exports: [WeatherCacheService, WeatherService],
})
export class WeatherModule {}
