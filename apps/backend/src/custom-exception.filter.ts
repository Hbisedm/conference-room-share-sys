import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host
      .switchToHttp()
      .getResponse<Response & { cause?: any }>();

    response
      .json({
        code: exception.getStatus(),
        message: exception.message || 'fail',
        // cause 拿到参数异常的报错
        data: exception.cause || exception.message,
      })
      .end();
  }
}
