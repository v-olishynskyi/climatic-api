import { WeatherByCityDto } from '../../infrastructure/weather/dto/get-weather.dto';
import { Subscription } from '../../modules/subscription/entities/subsciption.entity';

export interface WeatherUpdateMailData {
  subscription: Subscription;
  weather: WeatherByCityDto;
}
