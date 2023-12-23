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
    comment: '职位id',
  })
  id: number;

  @Column({
    length: 20,
    comment: '职位名称',
  })
  post_name: string;

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
