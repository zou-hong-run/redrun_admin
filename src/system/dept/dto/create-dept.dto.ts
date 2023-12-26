import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDeptDto {
  @ApiProperty()
  @IsNotEmpty({
    message: '部门名称不能为空',
  })
  dept_name: string;

  @ApiProperty()
  parentId: number;
}
