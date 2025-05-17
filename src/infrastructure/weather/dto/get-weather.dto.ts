import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class GetWeatherByCityDto {
  @ApiProperty({
    name: 'temperature',
    type: Number,
    example: 25,
    description: 'Current temperature',
  })
  temperature: number;

  @ApiProperty({
    name: 'humidity',
    type: Number,
    example: 65,
    description: 'Current humidity percentage',
  })
  humidity: number;

  @ApiProperty({
    name: 'description',
    type: String,
    example: 'Cloudy',
    description: 'Weather description',
  })
  description: string;

  @Exclude()
  icon: string;
}

export class GetWeatherByCityWithIconDto extends GetWeatherByCityDto {}

export class WeatherApiResponseDto {
  location: Location;
  current: Current;
}

export class WeatherApiError {
  error: {
    code: number;
    message: string;
  };
}

class Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

class Current {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
  air_quality: AirQuality;
}

class Condition {
  text: string;
  icon: string;
  code: number;
}

class AirQuality {
  co: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  'us-epa-index': number;
  'gb-defra-index': number;
}
