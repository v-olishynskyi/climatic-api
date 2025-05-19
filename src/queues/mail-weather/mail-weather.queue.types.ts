import { WeatherByCityDto } from '../../infrastructure/weather/dto/get-weather.dto';
import { Subscription } from '../../modules/subscription/entities/subsciption.entity';

export type MailWeatherQueueJobData = {
  subscription: Subscription;
  weather: WeatherByCityDto;
};
