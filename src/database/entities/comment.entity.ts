import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Blog } from './blog.entity';
import { User } from './user.entity';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class Comment extends AbstractEntity<Comment> {
  @PrimaryGeneratedColumn('uuid')
  comment_id: number;

  @Column({ nullable: false, type: 'uuid' })
  user_id: string;

  @Column({ nullable: false, type: 'uuid' })
  blog_id: string;

  @Column({ nullable: false })
  comment: string;

  @ManyToOne(() => Blog, (blog) => blog.blog_comment)
  @JoinColumn({ name: 'blog_id' })
  blog: number;

  @ManyToOne(() => User, (user) => user.user_comment)
  @JoinColumn({ name: 'user_id' })
  user: number;
}
