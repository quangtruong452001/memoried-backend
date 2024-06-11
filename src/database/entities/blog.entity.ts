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
  @PrimaryGeneratedColumn('uuid', {
    name: 'blog_id',
  })
  @Index()
  id: string;

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
    nullable: true,
  })
  type: string;

  @ManyToOne(() => User, (user) => user.user_blog)
  @JoinColumn({ name: 'author_id' })
  author: string;

  @OneToMany(() => Section, (section) => section.blog)
  blog_section: Section[];

  @OneToMany(() => Comment, (comment) => comment.blog)
  blog_comment: Comment[];

  @ManyToOne(() => Topic, (topic) => topic.topic_blog)
  @JoinColumn({ name: 'topic_id' })
  topic: string;
}
