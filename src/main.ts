import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './tracer';
import DataSource from './gateways/database/ormconfig';
import { jobCleanQueue } from './cleanQueue';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  await DataSource.initialize();
  jobCleanQueue();

  await app.listen(3000);
}

bootstrap();
