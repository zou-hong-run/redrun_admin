import { Dept } from 'src/system/dept/entities/dept.entity';
import { Menu } from 'src/system/menu/entities/menu.entity';
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
  name: 'role',
})
export class Role {
  @PrimaryGeneratedColumn({
    comment: '角色id',
  })
  id: number;

  @Column({
    length: 20,
    comment: '角色名',
  })
  role_name: string;

  @Column({
    length: 20,
    comment: '角色权限字符串',
  })
  role_key: string;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;

  @Column({
    nullable: true,
    comment: '备注',
    length: 50,
  })
  remark: string;

  // 用户部门
  @ManyToMany(() => Dept)
  @JoinTable({
    name: 'role_dept',
  })
  dept: Dept[];

  @ManyToMany(() => Menu)
  @JoinTable({
    name: 'role_menu',
  })
  menu: Menu[];
}
