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
  GetWeatherByCityDto,
  WeatherApiError,
} from '../dto/get-weather.dto';
import { AxiosError } from 'axios';

@Injectable()
export class WeatherService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getWeather(city: string): Promise<GetWeatherByCityDto> {
    try {
      // TODO: add url builder
      const { data } = await firstValueFrom(
        this.httpService.get<WeatherApiResponseDto>(
          `https://api.weatherapi.com/v1/current.json?q=${city}&key=480a8c6e7bcb4380a8d123007251405`,
        ),
      );

      return {
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        description: data.current.condition.text,
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
