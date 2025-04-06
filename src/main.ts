import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  app.enableCors({
    origin: ['https://example.com'], // Izinkan hanya domain tertentu
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Izinkan cookies
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
