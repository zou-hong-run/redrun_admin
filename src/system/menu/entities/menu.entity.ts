import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'menu',
})
export class Menu {
  @PrimaryGeneratedColumn({
    comment: '菜单id',
  })
  id: number;

  @Column({
    length: 20,
    comment: '菜单名',
  })
  menu_name: string;

  @Column({
    length: 20,
    comment: '路径',
    default: '',
  })
  path: string;

  @Column({
    nullable: true,
    length: 40,
    comment: '组件路径',
  })
  component: string;

  @Column({
    nullable: true,
    length: 20,
    comment: '权限标识',
  })
  perms: string;

  @Column({
    nullable: true,
    comment: '父级id',
  })
  parent_id: number;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;

  @Column({
    comment: '菜单类型',
    length: 10,
  })
  menu_type: string; // C目录，M:菜单，B:按钮

  @Column({
    nullable: true,
    comment: '备注',
    length: 50,
  })
  remark: string;
}
