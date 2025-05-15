import { Injectable } from '@nestjs/common';
import { SubscribeWeatherUpdatesDto } from '../dto';
import { WeatherService } from '../../../infrastructure/weather/services/weather.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly weatherService: WeatherService) {}

  async subscribeToWeatherUpdates(inputDto: SubscribeWeatherUpdatesDto) {
    // first we need to check if city is correct
    await this.weatherService.getWeather(inputDto.city);

    // if city is correct, we can send email with confirmation link to the weather updates

    return JSON.stringify(inputDto);
  }
}
