// src/main.worker.ts
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './queues/worker.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(WorkerModule, {
    logger: ['log', 'warn', 'error', 'debug'],
  });

  console.log('🚀 BullMQ Worker started');
}
bootstrap();
