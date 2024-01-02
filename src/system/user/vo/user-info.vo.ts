import { Dept } from 'src/system/dept/entities/dept.entity';
import { Menu } from 'src/system/menu/entities/menu.entity';
import { Post } from 'src/system/post/entities/post.entity';
import { Role } from 'src/system/role/entities/role.entity';

export class UserInfoVo {
  id: number;
  user_name: string;
  nick_name: string;
  email: string;
  avatar: string;
  phone_number: string;
  // 角色 菜单 部门 岗位
  roles: Role[];
  perms: string[];
  depts: Dept[];
  posts: Post[];
  create_time: Date;
}
