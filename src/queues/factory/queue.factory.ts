import { RegisterQueueAsyncOptions } from '@nestjs/bullmq';
import { QUEUE_CONFIG, QUEUE_NAMES } from '../constants';
import { AppConfigService } from '../../config/shared-config.service';
import { AppConfigModule } from '../../config/config.module';

export class QueueFactory {
  public static createQueueRegistrations(
    queueName: QUEUE_NAMES,
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
            db: QUEUE_CONFIG[queueName].db,
            // ...(process.env.NODE_END === 'production' ? { tls: {} } : {}),
          },
          prefix: QUEUE_CONFIG[queueName].prefix,
        };
      },
      inject: [AppConfigService],
      ...restOptions,
    };
  }
}
