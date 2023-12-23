import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from '../class/res.class';

@Catch(HttpException)
export class ResponseFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const statusCode = exception.getStatus();

    const res = exception.getResponse() as { message: string[] };
    console.log('responsefilter', exception.message, '===', res);

    let message = res?.message?.join
      ? res?.message?.join(',')
      : exception.message;

    let result = new ResponseDto(statusCode, message);

    response.status(statusCode).json(result);
  }
}
