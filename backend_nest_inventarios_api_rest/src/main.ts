import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // habilitando (VALIDACIÓN) con class-validation
  app.useGlobalPipes(new ValidationPipe())

  // hablitando (DOCS API) con swagger
  const config = new DocumentBuilder()
    .setTitle("Proyecto Backend API Rest Inventarios")
    .setDescription("Este proyecto es el Backend de un sistema de Inventarios")
    .setVersion("1.0")
    .addTag('Backend Nest')
    .addBearerAuth()
    .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);

    // habilitando CORS 
    app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
