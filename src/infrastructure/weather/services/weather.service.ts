import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  WeatherApiResponseDto,
  WeatherApiError,
  WeatherByCityDto,
} from '../dto/get-weather.dto';
import { AxiosError } from 'axios';
import { generateWeatherUrl } from '../../../shared/helpers';
import { WeatherCacheService } from './weather.cache.service';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly cache: WeatherCacheService,
  ) {}

  async getWeather(city: string): Promise<WeatherByCityDto> {
    try {
      const cached = await this.cache.get(city);

      if (cached) {
        return cached;
      }

      const { data } = await firstValueFrom(
        this.httpService.get<WeatherApiResponseDto>(generateWeatherUrl(city)),
      );

      const weather = {
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        description: data.current.condition.text,
        icon: data.current.condition.icon,
      };

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await this.cache.set(city, weather);

      return weather;
    } catch (error) {
      if (error?.isAxiosError) {
        const axiosError = error as AxiosError<WeatherApiError>;

        if (axiosError.response?.data.error.code === 1006) {
          throw new NotFoundException(`City ${city} not found`);
        }
      }

      throw new InternalServerErrorException(error);
    }
  }
}
