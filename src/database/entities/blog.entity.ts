import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  blog_id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  thumpnail: string;

  @Column({
    type: 'enum',
    enum: ['company', 'team', 'project'],
    default: 'company',
    nullable: false,
  })
  type: string;

  @Column({ nullable: false, type: 'uuid' })
  topic_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false, type: 'uuid' })
  createdBy: string;

  @Column({ nullable: false, type: 'uuid' })
  updatedBy: string;

  @ManyToOne(() => User, (user) => user.user_id)
  author: 'uuid';
}
