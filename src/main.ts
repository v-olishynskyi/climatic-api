import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import setupSwagger from './swagger';
import setupBullBoard from './setupBullBoard';
import { Transport } from '@nestjs/microservices';
import { QueueNamesEnum } from './queues/rabbitmq/enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  setupBullBoard(app.getHttpAdapter().getInstance());

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@rabbitmq:5672'],
      queue: QueueNamesEnum.SUBSCRIPTION_CONFIRMATION_MAIL_QUEUE,
      queueOptions: { durable: true },
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@rabbitmq:5672'],
      queue: QueueNamesEnum.WEATHER_UPDATE_DAILY_MAIL_QUEUE,
      queueOptions: { durable: true },
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@rabbitmq:5672'],
      queue: QueueNamesEnum.WEATHER_UPDATE_HOURLY_MAIL_QUEUE,
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
