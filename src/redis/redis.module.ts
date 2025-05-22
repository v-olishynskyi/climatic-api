import { Global, Module } from '@nestjs/common';
import { AppConfigService } from '../config/shared-config.service';
import { AppConfigModule } from '../config/config.module';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './constants';
import Debug from 'debug';
import { RedisFactory } from './factory/redis.factory';

Debug.enable('ioredis:*');

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: AppConfigService) => {
        return new Redis(RedisFactory.createRedisConfig(configService));
      },
      inject: [AppConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
