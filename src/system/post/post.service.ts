import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  @InjectRepository(Post)
  private postRepository: Repository<Post>;

  async create(createPostDto: CreatePostDto) {
    let post = new Post();
    post.post_code = createPostDto.post_code;
    post.post_name = createPostDto.post_name;
    try {
      await this.postRepository.save(post);
    } catch (error) {
      throw new HttpException('创建失败', HttpStatus.BAD_REQUEST);
    }
    return '创建成功';
  }

  async findAll() {
    try {
      return await this.postRepository.find();
    } catch (error) {
      throw new HttpException('查询失败', HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      return await this.postRepository.findOne({ where: { id: id } });
    } catch (error) {
      throw new HttpException('查询失败', HttpStatus.BAD_REQUEST);
    }
  }

  async update(updatePostDto: UpdatePostDto) {
    let post = await this.postRepository.findOne({
      where: { id: updatePostDto.id },
    });
    if (!post) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    try {
      post.post_code = updatePostDto.post_code;
      post.post_name = updatePostDto.post_name;
      await this.postRepository.save(post);
    } catch (error) {
      throw new HttpException('更新失败', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    let post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new HttpException('删除用户不存在', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.postRepository.remove(post);
    } catch (error) {
      throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
    }
  }
}
