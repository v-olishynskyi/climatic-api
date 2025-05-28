import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import setupSwagger from './swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  setupSwagger(app);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, 'views'));

  app.setViewEngine('ejs');

  await app.listen(3000);
}
bootstrap();
