import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Blog } from './blog.entity';
import { Note } from './note.entity';
import { Comment } from './comment.entity';
import { UserTopic } from './UserTopic.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid', {
    name: 'user_id',
  })
  @Index()
  id: number;

  @Column({ length: 30, nullable: false })
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false, type: 'uuid' })
  createdBy: string;

  @Column({ nullable: false, type: 'uuid' })
  updatedBy: string;

  @OneToMany(() => Blog, (blog) => blog.author)
  user_blog: 'uuid';

  @OneToMany(() => Note, (note) => note.user)
  user_note: 'uuid';

  @OneToMany(() => Comment, (comment) => comment.user)
  user_comment: 'uuid';

  @OneToMany(() => UserTopic, (userTopic) => userTopic.user)
  user_userTopic: 'uuid';

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
