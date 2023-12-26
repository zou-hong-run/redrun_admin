import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('角色管理')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({
    summary: '添加角色',
  })
  @ApiBody({
    type: CreateRoleDto,
  })
  @Post('create')
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }

  @ApiOperation({
    summary: '获取角色列表',
  })
  @Get('list')
  async findAll() {
    return await this.roleService.findAll();
  }

  @ApiOperation({
    summary: '获取单个角色信息',
  })
  @Get('info')
  async findOne(@Query('id') id: string) {
    return await this.roleService.findOne(+id);
  }

  @ApiOperation({
    summary: '删除角色',
  })
  @ApiBody({
    type: UpdateRoleDto,
  })
  @Patch('update')
  async update(@Body() updateRoleDto: UpdateRoleDto) {
    return await this.roleService.update(updateRoleDto);
  }

  @Delete('delete')
  async remove(@Query('id') id: string) {
    return await this.roleService.remove(+id);
  }
}
