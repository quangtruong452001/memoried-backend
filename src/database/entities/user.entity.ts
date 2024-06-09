import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from 'typeorm';
import { Blog } from './blog.entity';
import { Note } from './note.entity';
import { Comment } from './comment.entity';
import { UserTopic } from './UserTopic.entity';
import { AbstractEntity } from './abstract.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User extends AbstractEntity<User> {
  @PrimaryGeneratedColumn('uuid', {
    name: 'user_id',
  })
  @Index()
  id: string;

  @Column({ length: 30, nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  role: string;

  @Column({ default: '' })
  refreshTokenHashed: string;

  @OneToMany(() => Blog, (blog) => blog.author)
  user_blog: 'uuid';

  @OneToMany(() => Note, (note) => note.user)
  user_note: 'uuid';

  @OneToMany(() => Comment, (comment) => comment.user)
  user_comment: 'uuid';

  @OneToMany(() => UserTopic, (userTopic) => userTopic.user)
  user_userTopic: 'uuid';
}
