import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { ErrorExceptionFilter } from './exceptions/exception.error';
import { ValidationPipe } from '@nestjs/common';
//apply dotenv
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable cors
  app.enableCors({});

  // Add cookie parser middleware
  app.use(cookieParser());

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Using error filter
  app.useGlobalFilters(new ErrorExceptionFilter());

  await app.listen(3000);
}
bootstrap();
