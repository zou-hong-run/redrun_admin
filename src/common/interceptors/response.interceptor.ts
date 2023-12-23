import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ResponseDto } from '../class/res.class';
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<any>> {
    return next.handle().pipe(
      map((data) => {
        let result = new ResponseDto(200, 'success', data);
        return result;
      }),
    );
  }
}
