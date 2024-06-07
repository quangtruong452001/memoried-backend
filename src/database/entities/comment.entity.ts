import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Blog } from './blog.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
  @PrimaryColumn({ type: 'uuid' })
  comment_id: number;

  @Column({ nullable: false, type: 'uuid' })
  user_id: string;

  @Column({ nullable: false, type: 'uuid' })
  blog_id: string;

  @Column({ nullable: false })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false, type: 'uuid' })
  createdBy: string;

  @Column({ nullable: false, type: 'uuid' })
  updatedBy: string;

  @ManyToOne(() => Blog, (blog) => blog.blog_comment)
  @JoinColumn({ name: 'blog_id' })
  blog: number;

  @ManyToOne(() => User, (user) => user.user_comment)
  @JoinColumn({ name: 'user_id' })
  user: number;
}
