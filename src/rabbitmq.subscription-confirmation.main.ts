import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RabbitMQModule } from './queues/rabbitmq/rabbitmq.module';
import { QueueNamesEnum } from './queues/rabbitmq/enum';
import RabbitMQFactory from './queues/rabbitmq/factory/rabbitmq.factory';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RabbitMQModule,
    RabbitMQFactory.createRabbitMQClientOptions(
      QueueNamesEnum.SUBSCRIPTION_CONFIRMATION_MAIL_QUEUE,
    ),
  );
  console.log('Starting Subscription Confirmation Mail Microservice...');

  await app.listen();
}
bootstrap();
