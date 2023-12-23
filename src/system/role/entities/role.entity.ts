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

  @ManyToMany(() => Menu)
  @JoinTable({
    name: 'role_menu',
  })
  menu: Menu[];
}
