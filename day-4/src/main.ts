import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const descriptionHTML = [
    '<pre>',
      'Nama Lengkap : Bagus Maulana Hasan',
      '<br/>',
      'NIM          : 221011400240',
    '</pre>'
  ].join('');

  const config = new DocumentBuilder()
    .setTitle('Avalanche dApp')
    .setDescription(descriptionHTML)
    .setVersion('1.0')
    .addTag('Backend API', 'NestJS & Swagger')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('documentation', app, document, {
    customSiteTitle: 'day-4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
    ],
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();