import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken'; // Ensure this import matches where your TokenExpiredError is coming from

@Catch()
export class TokenExpiredExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof TokenExpiredError) {
      response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
        message: 'Access token expired',
      });
    } else if (exception instanceof HttpException) {
      // Handle standard NestJS exceptions
      const status = exception.getStatus();
      response.status(status).json(exception.getResponse());
    } else {
      // Fallback for unhandled exceptions
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
        message: 'Internal server error',
      });
    }
  }
}
