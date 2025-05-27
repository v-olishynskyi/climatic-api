import { RmqOptions, Transport } from '@nestjs/microservices';
import { QueueNamesEnum } from '../enum';

export default class RabbitMQFactory {
  static resolveQueueName(baseName: string): string {
    const suffix = process.env.NODE_ENV === 'development' ? '_dev' : '';
    return `${baseName}${suffix}`;
  }

  static createRabbitMQUrl() {
    return {
      hostname: process.env.RABBITMQ_HOST,
      port: Number(process.env.RABBITMQ_PORT),
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
      vhost: process.env.RABBITMQ_VHOST,
      locale: process.env.RABBITMQ_LOCALE,
      frameMax: Number(process.env.RABBITMQ_FRAME_MAX),
      heartbeat: Number(process.env.RABBITMQ_HEARTBEAT),
    };
  }

  static createRabbitMQClient(
    queueName: QueueNamesEnum,
    restOptions?: Omit<RmqOptions, 'transport'>,
  ): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [RabbitMQFactory.createRabbitMQUrl()],
        queue: RabbitMQFactory.resolveQueueName(queueName),
        queueOptions: { durable: true },
        // @ts-ignore
        connectionOptions: { heartbeatIntervalInSeconds: 5 },
        socketOptions: { heartbeatIntervalInSeconds: 5 },
        heartbeatIntervalInSeconds: 5,
        ...restOptions?.options,
      },
      ...restOptions,
    };
  }
}
