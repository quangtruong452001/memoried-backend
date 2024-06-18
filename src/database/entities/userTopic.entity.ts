import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Topic } from './topic.entity';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class UserTopic extends AbstractEntity<UserTopic> {
  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @PrimaryColumn({ type: 'uuid' })
  topic_id: string;

  @ManyToOne(() => User, (user) => user.user_userTopic)
  @JoinColumn({ name: 'user_id' })
  user: string;

  @ManyToOne(() => Topic, (topic) => topic.topic_userTopic)
  @JoinColumn({ name: 'topic_id' })
  topic: string;
}
