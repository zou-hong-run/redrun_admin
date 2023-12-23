import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'dept',
})
export class Dept {
  @PrimaryGeneratedColumn({
    comment: '部门id',
  })
  id: number;

  @Column({
    length: 20,
    comment: '部门名称',
  })
  dept_name: string;

  @Column({
    length: 20,
    comment: '上级部门id',
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
