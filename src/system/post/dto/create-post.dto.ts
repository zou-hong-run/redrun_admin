import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  post_name: string;

  @ApiProperty()
  @IsNotEmpty()
  post_code: string;
}
