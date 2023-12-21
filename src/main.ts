import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 403,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Forum API')
    .setDescription('RESTful API for Forum Website with NestJS.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
