import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('岗位管理')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: '添加岗位',
  })
  @ApiBody({
    type: CreatePostDto,
  })
  @Post('create')
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postService.create(createPostDto);
  }

  @ApiOperation({
    summary: '获取所有岗位信息',
  })
  @Get('list')
  async findAll() {
    return await this.postService.findAll();
  }

  @ApiOperation({
    summary: '获取单个岗位信息',
  })
  @ApiQuery({
    name: 'id',
    description: '查询岗位的id',
  })
  @Get('info')
  async findOne(@Query('id') id: string) {
    return await this.postService.findOne(+id);
  }

  @ApiOperation({
    summary: '更新岗位信息',
  })
  @ApiBody({
    type: UpdatePostDto,
  })
  @Patch('update')
  async update(@Body() updatePostDto: UpdatePostDto) {
    return await this.postService.update(updatePostDto);
  }

  @Delete('delete')
  async remove(@Query('id') id: string) {
    return await this.postService.remove(+id);
  }
}
