import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
