import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
const chalk = require('chalk')

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        tap({
          next: (data) => {
            // Here you can deal with successful answers if necessary
          },
          error: (error) => {
            const data = error.response.data
            const statusCode = data.statusCode
            const statusMessage = data.error
            const message = data.message || 'Unknown error';

            console.log(chalk.magenta(`\nStatus Code: ${statusCode} ${statusMessage}\nMessage: ${message}\n`));
          },
        }),
      );
  }
}