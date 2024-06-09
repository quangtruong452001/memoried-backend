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

  @ManyToOne(() => User, (user) => user.user_blog)
  @JoinColumn({ name: 'author_id' })
  author: number;

  @OneToMany(() => Section, (section) => section.blog)
  blog_section: 'uuid';

  @OneToMany(() => Comment, (comment) => comment.blog)
  blog_comment: 'uuid';

  @ManyToOne(() => Topic, (topic) => topic.topic_blog)
  @JoinColumn({ name: 'topic_id' })
  topic: number;
}
