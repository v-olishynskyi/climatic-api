import { RedisOptions } from 'ioredis';
import { AppConfigService } from '../../config/shared-config.service';

export class RedisFactory {
  static createRedisConfig(
    configService: AppConfigService,
    rest?: Omit<RedisOptions, 'host' | 'port' | 'password' | 'tls'>,
  ): RedisOptions {
    return {
      host: configService.get('redis.REDIS_HOST'),
      port: configService.get('redis.REDIS_PORT'),
      password: configService.get('redis.REDIS_PASSWORD'),
      ...(process.env.NODE_ENV === 'production' ? { tls: {} } : {}),
      ...rest,
    };
  }
}
