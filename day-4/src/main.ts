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
    customCss: `
      body { background-color: #121212 !important; }
      .swagger-ui { color: #ccc; }
      .swagger-ui .info .title { color: #fff !important; }
      .swagger-ui .info { margin: 20px 0; }
      .topbar { background-color: #000 !important; border-bottom: 1px solid #333; }
      .swagger-ui .opblock-tag { color: #fff !important; border-bottom: 1px solid #333; }
      .swagger-ui .opblock-summary-path { color: #fff !important; }
      .swagger-ui .opblock-summary-description { color: #999 !important; }
    `,
  });
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();