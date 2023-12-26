import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  role_name: string;

  @ApiProperty()
  @IsNotEmpty()
  role_key: string;

  @ApiProperty()
  menu: number[];

  @ApiProperty()
  dept: number[];
}
