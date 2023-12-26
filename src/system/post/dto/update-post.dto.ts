import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
