import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Climatic api')
    .setDescription(
      `Weather API application that allows users to subscribe to weather updates for their city.`,
    )
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
