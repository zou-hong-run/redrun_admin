import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { DeptService } from './dept.service';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('部门管理模块')
@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @ApiOperation({
    summary: '创建部门',
  })
  @Post('create')
  async create(@Body() createDeptDto: CreateDeptDto) {
    return await this.deptService.create(createDeptDto);
  }

  @ApiOperation({
    summary: '获取部门列表',
  })
  @Get('list')
  async findAll(@Req() req: Request) {
    let user_id = req.user.user_id;

    return await this.deptService.findAll(user_id);
  }

  @ApiOperation({
    summary: '查找单个部门',
  })
  @ApiQuery({
    name: 'id',
    description: '部门id',
  })
  @Get('info')
  async info(@Query('id') id: string) {
    return await this.deptService.info(+id);
  }

  @ApiOperation({
    summary: '更新部门',
  })
  @ApiBody({
    type: UpdateDeptDto,
  })
  @Patch('update')
  async update(@Body() updateDeptDto: UpdateDeptDto) {
    return await this.deptService.update(updateDeptDto);
  }

  @ApiOperation({
    summary: '删除部门',
  })
  @ApiQuery({
    name: 'id',
    description: '删除id',
  })
  @Delete('remove')
  async remove(@Query('id') id: string) {
    return await this.deptService.remove(+id);
  }
}
