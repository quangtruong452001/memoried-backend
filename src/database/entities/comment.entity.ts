import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Blog } from './blog.entity';
import { User } from './user.entity';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class Comment extends AbstractEntity<Comment> {
  @PrimaryGeneratedColumn('uuid', {
    name: 'comment_id',
  })
  @Index()
  id: string;

  @Column({ nullable: false })
  comment: string;

  @ManyToOne(() => Blog, (blog) => blog.blog_comment)
  @JoinColumn({ name: 'blog_id' })
  blog: string;

  @ManyToOne(() => User, (user) => user.user_comment)
  @JoinColumn({ name: 'user_id' })
  user: string;
}
