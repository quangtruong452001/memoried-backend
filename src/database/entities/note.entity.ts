import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Section } from './section.entity';
import { User } from './user.entity';

@Entity()
export class Note {
  @PrimaryColumn({ type: 'uuid' })
  section_id: string;

  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false, type: 'uuid' })
  createdBy: string;

  @Column({ nullable: false, type: 'uuid' })
  updatedBy: string;

  @ManyToOne(() => Section, (section) => section.section_note)
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @ManyToOne(() => User, (user) => user.user_note)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
