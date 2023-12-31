import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'post',
})
export class Post {
  @PrimaryGeneratedColumn({
    comment: '岗位id',
  })
  id: number;

  @Column({
    length: 20,
    comment: '岗位名称',
  })
  post_name: string;

  @Column({
    length: 20,
    comment: '岗位编码',
  })
  post_code: string;

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
