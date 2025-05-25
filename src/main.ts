import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import setupSwagger from './swagger';
import { Transport } from '@nestjs/microservices';
import { QueueNamesEnum } from './queues/rabbitmq/enum';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  setupSwagger(app);

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

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.setViewEngine('ejs');

  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
