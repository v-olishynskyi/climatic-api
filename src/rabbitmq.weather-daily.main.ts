import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RabbitMQModule } from './queues/rabbitmq/rabbitmq.module';
import { QueueNamesEnum } from './queues/rabbitmq/enum';
import RabbitMQFactory from './queues/rabbitmq/factory/rabbitmq.factory';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RabbitMQModule,
    RabbitMQFactory.createRabbitMQClient(
      QueueNamesEnum.WEATHER_UPDATE_DAILY_MAIL_QUEUE,
    ),
  );
  console.log('Starting Weather Update Daily Mail Microservice...');

  await app.listen();
}
bootstrap();
