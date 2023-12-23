import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
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
    comment: '父id',
  })
  parent_id: string;

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
}
