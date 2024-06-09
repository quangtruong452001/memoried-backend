import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Topic } from './topic.entity';

@Entity()
export class UserTopic {
  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn()
  topic_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false, type: 'uuid' })
  createdBy: string;

  @Column({ nullable: false, type: 'uuid' })
  updatedBy: string;

  @ManyToOne(() => User, (user) => user.user_userTopic)
  @JoinColumn({ name: 'user_id' })
  user: number;

  @ManyToOne(() => Topic, (topic) => topic.topic_userTopic)
  @JoinColumn({ name: 'topic_id' })
  topic: number;
}
