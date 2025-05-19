import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from '../../../redis/constants';
import Redis from 'ioredis';
import { WeatherByCityDto } from '../dto/get-weather.dto';

@Injectable()
export class WeatherCacheService {
  private readonly TTL = 60 * 60; // 1 hour

  constructor(@Inject(REDIS_CLIENT) private redis: Redis) {}

  private getKey(city: string): string {
    return `weather:${city.toLowerCase()}`;
  }

  async get(city: string): Promise<WeatherByCityDto | null> {
    const raw = await this.redis.get(this.getKey(city));

    if (!raw) return null;

    return JSON.parse(raw) as WeatherByCityDto | null;
  }

  async set(city: string, data: WeatherByCityDto): Promise<void> {
    await this.redis.set(
      this.getKey(city),
      JSON.stringify(data),
      'EX',
      this.TTL,
    );
  }
}
