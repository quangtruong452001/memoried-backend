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

@Entity()
export class Images {
  @PrimaryColumn({ type: 'uuid' })
  image_id: number;

  @Column({ nullable: false })
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false, type: 'uuid' })
  createdBy: string;

  @Column({ nullable: false, type: 'uuid' })
  updatedBy: string;

  @ManyToOne(() => Section, (section) => section.section_image)
  @JoinColumn({ name: 'section_id' })
  section: number;
}
