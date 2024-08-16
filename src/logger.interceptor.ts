import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;

    console.log(`Request: ${method} ${url}`);
    console.log(`Request Body: `, body);
    console.log(`Request Query: `, query);
    console.log(`Request Params: `, params);

    const now = Date.now();

    return next.handle().pipe(
      tap((response) =>
        console.log(
          `Response: ${method} ${url} - ${Date.now() - now}ms`,
          response,
        ),
      ),
      catchError((err) => {
        const statusCode =
          err instanceof HttpException
            ? err.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        console.error(
          `Error Response: ${method} ${url} - ${statusCode} - ${Date.now() - now}ms`,
          err.response.message[0] || err,
        );

        return throwError(() => err);
      }),
    );
  }
}
