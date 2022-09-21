import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.createApplicationContext(AppModule);

  app.enableShutdownHooks();
}

void bootstrap();
