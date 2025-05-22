import { RegisterQueueAsyncOptions } from '@nestjs/bullmq';
import { QUEUE_CONFIG } from '../constants';
import { AppConfigService } from '../../config/shared-config.service';
import { AppConfigModule } from '../../config/config.module';
import { QueueNamesEnum } from '../enum';

export class QueueFactory {
  public static createQueueRegistrations(
    queueName: QueueNamesEnum,
    restOptions?: Omit<
      RegisterQueueAsyncOptions,
      'name' | 'useFactory' | 'inject'
    >,
  ): RegisterQueueAsyncOptions {
    return {
      imports: [AppConfigModule],
      name: queueName,
      useFactory: (configService: AppConfigService) => {
        return {
          connection: {
            host: configService.get('redis.REDIS_HOST'),
            port: configService.get('redis.REDIS_PORT'),
            password: configService.get('redis.REDIS_PASSWORD'),
            db: QUEUE_CONFIG[queueName].db,
            ...(process.env.NODE_ENV === 'production' ? { tls: {} } : {}),
          },
          prefix: QUEUE_CONFIG[queueName].prefix,
          skipVersionCheck: true,
        };
      },
      inject: [AppConfigService],
      ...restOptions,
    };
  }
}
