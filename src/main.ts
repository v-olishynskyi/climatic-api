import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import setupSwagger from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
