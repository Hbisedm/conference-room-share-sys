import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    let message = 'success';
    if (
      context.switchToHttp().getRequest<Request>().route.path === '/user/login'
    ) {
      message = '登录成功';
    }

    return next.handle().pipe(
      map((data) => {
        return {
          code: [200, 201].includes(response.statusCode)
            ? '000000'
            : response.statusCode,
          message,
          data,
        };
      }),
    );
  }
}
