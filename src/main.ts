import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import setupSwagger from './swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

const viewsPath =
  process.env.NODE_ENV === 'development'
    ? join(__dirname, '..', 'src', 'views')
    : join(__dirname, 'views');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  setupSwagger(app);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(viewsPath);

  app.setViewEngine('ejs');

  await app.listen(3000);
}
bootstrap();
