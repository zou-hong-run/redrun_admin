import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Delete,
  Req,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('菜单管理')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({
    summary: '创建菜单',
  })
  @ApiBody({
    type: CreateMenuDto,
  })
  @Post('create')
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @ApiOperation({
    summary: '获取菜单列表',
  })
  @Get('list')
  async findAll() {
    return await this.menuService.getMenus();
  }

  @ApiOperation({
    summary: '获取单个菜单信息',
  })
  @Get('info')
  info(@Query('id') id: string) {
    return this.menuService.info(+id);
  }

  @ApiOperation({
    summary: '更新菜单信息',
  })
  @ApiBody({
    type: UpdateMenuDto,
  })
  @Patch('update')
  update(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(updateMenuDto);
  }

  @ApiOperation({
    summary: '删除菜单信息',
  })
  @Delete('delete')
  async remove(@Query('id') id: string) {
    return this.menuService.remove(+id);
  }
}
