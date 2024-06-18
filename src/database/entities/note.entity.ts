import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Section } from './section.entity';
import { User } from './user.entity';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class Note extends AbstractEntity<Section> {
  @PrimaryColumn({ type: 'uuid' })
  section_id: string;

  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => Section, (section) => section.section_note)
  @JoinColumn({ name: 'section_id' })
  section: string;

  @ManyToOne(() => User, (user) => user.user_note)
  @JoinColumn({ name: 'user_id' })
  user: string;

  @Column({ nullable: false, type: 'uuid' })
  createdBy: string;

  @Column({ nullable: false, type: 'uuid' })
  updatedBy: string;
}
