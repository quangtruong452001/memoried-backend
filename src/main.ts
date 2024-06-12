import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
//apply dotenv
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable cors
  app.enableCors({});

  // Add cookie parser middleware
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
