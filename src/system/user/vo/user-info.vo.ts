export class UserInfoVo {
  id: number;
  user_name: string;
  nick_name: string;
  email: string;
  avatar: string;
  phone_number: string;
  // 角色 菜单 部门 岗位
  // roles: string[];
  // perms: string[];
  depts: string[];
  posts: string[];
  create_time: Date;
}
