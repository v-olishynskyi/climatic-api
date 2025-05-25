import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RabbitMQModule } from './queues/rabbitmq/rabbitmq.module';
import { QueueNamesEnum } from './queues/rabbitmq/enum';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RabbitMQModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL!],
        queue: QueueNamesEnum.WEATHER_UPDATE_HOURLY_MAIL_QUEUE,
        queueOptions: { durable: true },
      },
    },
  );

  await app.listen();
}
bootstrap();
