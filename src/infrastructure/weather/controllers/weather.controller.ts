import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { WeatherService } from '../services/weather.service';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { WeatherByCityDto } from '../dto/get-weather.dto';

@Controller('')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @ApiOperation({
    summary: 'Get current weather for a city',
    description:
      'Returns the current weather forecast for the specified city using WeatherAPI.com.',
  })
  @ApiOkResponse({
    type: [WeatherByCityDto],
    description: 'Successful operation - current weather forecast returned',
  })
  @ApiNotFoundResponse({ description: 'City not found' })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiQuery({
    name: 'city',
    required: true,
    type: String,
    description: 'City name for weather forecast',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: WeatherByCityDto })
  @Get('/weather')
  getWeatherByCity(@Query('city') city: string): Promise<WeatherByCityDto> {
    if (!city.trim()) {
      throw new BadRequestException();
    }

    return this.weatherService.getWeather(city);
  }
}
