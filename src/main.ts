import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './tracer';
import DataSource from './gateways/database/ormconfig'
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  await DataSource.initialize();
  await app.listen(3000);
}

bootstrap();
