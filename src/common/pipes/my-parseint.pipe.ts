import { BadRequestException, ParseIntPipe } from '@nestjs/common';

export const generateParseIntPipe = (name: string) => {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(name + '应该为数字');
    },
  });
};
