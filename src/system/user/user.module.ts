import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Menu } from '../menu/entities/menu.entity';
import { Post } from '../post/entities/post.entity';
import { Dept } from '../dept/entities/dept.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Menu, Post, Dept])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
