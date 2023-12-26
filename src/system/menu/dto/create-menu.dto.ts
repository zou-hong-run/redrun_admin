import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty()
  @IsNotEmpty()
  menu_name: string;

  @ApiProperty()
  @IsNotEmpty()
  path: string;

  @ApiProperty()
  component: string;

  @ApiProperty()
  perms: string;
  @ApiProperty()
  parent_id: number;
}
