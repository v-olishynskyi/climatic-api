import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  WeatherApiResponseDto,
  WeatherApiError,
  GetWeatherByCityWithIconDto,
} from '../dto/get-weather.dto';
import { AxiosError } from 'axios';

@Injectable()
export class WeatherService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getWeather(city: string): Promise<GetWeatherByCityWithIconDto> {
    try {
      // TODO: add url builder
      const { data } = await firstValueFrom(
        this.httpService.get<WeatherApiResponseDto>(
          `https://api.weatherapi.com/v1/current.json?q=${city}&key=${this.configService.get('WEATHER_API_KEY')}`,
        ),
      );

      return {
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        description: data.current.condition.text,
        icon: data.current.condition.icon,
      };
    } catch (error) {
      if (error?.isAxiosError) {
        const axiosError = error as AxiosError<WeatherApiError>;

        if (axiosError.response?.data.error.code === 1006) {
          throw new NotFoundException('City not found');
        }
      }

      throw new InternalServerErrorException(error);
    }
  }
}
