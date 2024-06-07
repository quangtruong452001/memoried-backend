import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Section } from './section.entity';
import { Comment } from './comment.entity';
import { Topic } from './topic.entity';

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
