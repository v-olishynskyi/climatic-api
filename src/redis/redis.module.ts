import { Global, Module } from '@nestjs/common';
import { AppConfigService } from '../config/shared-config.service';
import { AppConfigModule } from '../config/config.module';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './constants';
import Debug from 'debug';

Debug.enable('ioredis:*');

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: AppConfigService) => {
        return new Redis({
          host: configService.get('redis.REDIS_HOST'),
          port: configService.get('redis.REDIS_PORT'),
          password: configService.get('redis.REDIS_PASSWORD'),
          ...(process.env.NODE_ENV === 'production' ? { tls: {} } : {}),
        });
      },
      inject: [AppConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
