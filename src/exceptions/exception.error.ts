import { LoggerService } from './../logger/logger.service';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken'; // Ensure this import matches where your TokenExpiredError is coming from

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  private readonly loggerService = new LoggerService();

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof TokenExpiredError) {
      // log the error
      this.loggerService.error(
        exception.message,
        exception.stack,
        'TokenExpiredError',
      );

      response.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: exception.message,
        metaData: {
          timestamp: new Date().toISOString(),
          path: ctx.getRequest().url,
        },
      });
    } else if (exception instanceof UnauthorizedException) {
      // log the error
      this.loggerService.error(
        exception.message,
        exception.stack,
        'UnauthorizedException',
      );

      response.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: exception.message,
        metaData: {
          timestamp: new Date().toISOString(),
          path: ctx.getRequest().url,
        },
      });
    } else if (exception instanceof BadRequestException) {
      const message =
        exception.message !== 'Bad Request Exception'
          ? exception.message
          : (exception.getResponse() as Error).message;
      // log the error
      this.loggerService.error(message, exception.stack, 'BadRequestException');

      // Handle bad request exceptions
      response.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message,
        metadata: {
          metaDamp: new Date().toISOString(),
          path: ctx.getRequest().url,
        },
      });
    } else if (exception instanceof NotFoundException) {
      // log the error
      this.loggerService.error(
        exception.message,
        exception.stack,
        'NotFoundException',
      );

      // Handle not found exceptions
      response.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        message: exception.message,
        metadata: {
          timestamp: new Date().toISOString(),
          path: ctx.getRequest().url,
        },
      });
    } else if (exception instanceof ForbiddenException) {
      // log the error
      this.loggerService.error(
        exception.message,
        exception.stack,
        'ForbiddenException',
      );

      // Handle forbidden exceptions
      response.status(HttpStatus.FORBIDDEN).json({
        status: HttpStatus.FORBIDDEN,
        message: exception.message,
        metadata: {
          timestamp: new Date().toISOString(),
          path: ctx.getRequest().url,
        },
      });
    } else {
      // Fallback for unhandled exceptions
      // log the error
      this.loggerService.error(
        exception instanceof Error
          ? exception.message
          : 'Internal server error',
        exception instanceof Error ? exception.stack : 'Internal server error',
        'Internal server error',
      );

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        metadata: {
          timestamp: new Date().toISOString(),
          path: ctx.getRequest().url,
        },
      });
    }
  }
}
