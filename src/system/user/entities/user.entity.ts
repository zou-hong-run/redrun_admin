import { Post } from 'src/system/post/entities/post.entity';
import { Role } from 'src/system/role/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn({
    comment: '用户id',
  })
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
  })
  user_name: string;

  @Column({
    length: 50,
    // 查询隐藏
    // select: false,
    comment: '密码',
  })
  password: string;

  @Column({
    length: 50,
    comment: '昵称',
  })
  nick_name: string;

  @Column({
    length: 50,
    comment: '邮箱',
  })
  email: string;

  @Column({
    nullable: true,
    length: 50,
    comment: '电话号码',
  })
  phone_number: string;

  @Column({
    nullable: true,
    comment: '用户类别', // 00 系统用户，**其他用户
    default: '00',
  })
  user_type: number;

  @Column({
    nullable: true,
    comment: '用户性别', // 0 男 1 女 * 未知
    default: 0,
  })
  gender: number;

  @Column({
    nullable: true,
    comment: '用户头像',
    length: 50,
  })
  avatar: string;

  @Column({
    nullable: true,
    comment: '用户状态', // 0正常 1冻结
    default: 0,
  })
  status: number;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;

  @Column({
    nullable: true,
    comment: '用户备注',
    length: 50,
  })
  remark: string;

  // 用户角色
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
  })
  role: Role[];

  // 用户职位
  @ManyToMany(() => Post)
  @JoinTable({
    name: 'user_post',
  })
  post: Post[];
}
