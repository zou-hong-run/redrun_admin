export class ResponseDto<T> {
  readonly data: T;
  readonly code: number;
  readonly message: string;
  constructor(code: number, message = 'sucess', data?: any) {
    this.data = data;
    this.code = code;
    this.message = message;
  }
}
