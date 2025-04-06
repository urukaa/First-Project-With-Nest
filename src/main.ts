import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  const whitelist = ['https://yourdomain.com', 'https://admin.yourdomain.com'];
  app.enableCors({
    origin: (origin, callback) => {
     if (origin && whitelist.includes(origin)) {
       callback(null, true);
     } else {
       callback(new Error('Not allowed by CORS'));
     }
    },
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
