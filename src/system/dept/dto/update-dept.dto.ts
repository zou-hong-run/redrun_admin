import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDeptDto } from './create-dept.dto';
import { IsNumber } from 'class-validator';

export class UpdateDeptDto extends PartialType(CreateDeptDto) {
  @ApiProperty()
  @IsNumber()
  id: number;
}
