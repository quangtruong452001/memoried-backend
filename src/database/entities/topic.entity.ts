import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { UserTopic } from './UserTopic.entity';
import { Blog } from './blog.entity';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class Topic extends AbstractEntity<Topic> {
  @PrimaryGeneratedColumn('uuid', {
    name: 'topic_id',
  })
  @Index()
  id: string;

  @Column({
    type: 'enum',
    enum: ['team', 'project'],
    nullable: false,
  })
  type: string;

  @Column({ nullable: false })
  topic_name: string;

  @OneToMany(() => UserTopic, (userTopic) => userTopic.topic)
  topic_userTopic: UserTopic[];

  @OneToMany(() => Blog, (blog) => blog.topic)
  topic_blog?: Blog[];

  @Column({ nullable: false, type: 'uuid' })
  createdBy: string;

  @Column({ nullable: false, type: 'uuid' })
  updatedBy: string;
}
