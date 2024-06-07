import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { UserTopic } from './UserTopic.entity';
import { Blog } from './blog.entity';

@Entity()
export class Topic {
  @PrimaryColumn({ type: 'uuid' })
  topic_id: number;

  @Column({
    type: 'enum',
    enum: ['team', 'project'],
    nullable: false,
  })
  type: string;

  @Column({ nullable: false })
  topic_name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false, type: 'uuid' })
  createdBy: string;

  @Column({ nullable: false, type: 'uuid' })
  updatedBy: string;

  @OneToMany(() => UserTopic, (userTopic) => userTopic.topic)
  topic_userTopic: string;

  @OneToMany(() => Blog, (blog) => blog.topic)
  topic_blog: string;
}
