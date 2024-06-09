import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Section } from './section.entity';
import { Comment } from './comment.entity';
import { Topic } from './topic.entity';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class Blog extends AbstractEntity<Blog> {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  blog_id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  thumbnail: string;

  @Column({
    type: 'enum',
    enum: ['company', 'team', 'project'],
    default: 'company',
    nullable: false,
  })
  type: string;

  @Column({ nullable: false, type: 'uuid' })
  topic_id: string;

  // @ManyToOne(() => User, (user) => user.user_blog)
  // @JoinColumn({ name: 'author_id' })
  // author: number;

  @ManyToOne(() => User, (user) => user.user_blog)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => Section, (section) => section.blog_id)
  blog_section: Section[];

  @OneToMany(() => Comment, (comment) => comment.blog_id)
  blog_comment: Comment[];

  @ManyToOne(() => Topic, (topic) => topic.topic_blog)
  @JoinColumn({ name: 'topic_id' })
  topic: number;
}
