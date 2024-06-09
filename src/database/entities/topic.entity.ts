import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserTopic } from './UserTopic.entity';
import { Blog } from './blog.entity';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class Topic extends AbstractEntity<Topic> {
  @PrimaryGeneratedColumn('uuid')
  topic_id: number;

  @Column({
    type: 'enum',
    enum: ['team', 'project'],
    nullable: false,
  })
  type: string;

  @Column({ nullable: false })
  topic_name: string;

  @OneToMany(() => UserTopic, (userTopic) => userTopic.topic)
  topic_userTopic: string;

  @OneToMany(() => Blog, (blog) => blog.topic)
  topic_blog: string;
}
