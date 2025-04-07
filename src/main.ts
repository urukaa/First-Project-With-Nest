import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  LOGGING
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  // API DOCS WITH SWAGGER
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MM TOPUP')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth() // jika pakai JWT
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document); // akses di /api/docs

  // CORS ORIGIN
  const rawOrigins = process.env.ORIGINS || '';
  const allowedOrigins = rawOrigins
    ? rawOrigins.split(',').map((origin) => origin.trim())
    : ['*'];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Izinkan cookies
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
