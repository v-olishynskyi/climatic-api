import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import setupSwagger from './swagger';
import setupBullBoard from './setupBullBoard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  setupBullBoard(app.getHttpAdapter().getInstance());

  await app.listen(3000);
}
bootstrap();
