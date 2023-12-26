import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { IsNumber } from 'class-validator';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @ApiProperty()
  @IsNumber()
  id: number;
}
