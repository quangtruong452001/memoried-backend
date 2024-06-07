import { Blog } from './blog.entity';
import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class Section {
  @PrimaryColumn({ type: 'uuid' })
  section_id: number;

  @Column({ nullable: false, type: 'uuid' })
  blog_id: string;

  @Column({ nullable: false })
  caption: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false, type: 'uuid' })
  createdBy: string;

  @Column({ nullable: false, type: 'uuid' })
  updatedBy: string;
}
