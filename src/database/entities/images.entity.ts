import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Section } from './section.entity';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class Images extends AbstractEntity<Images> {
  @PrimaryGeneratedColumn('uuid', {
    name: 'image_id',
  })
  @Index()
  id: string;

  @Column({ nullable: false })
  url: string;

  @ManyToOne(() => Section, (section) => section.section_image)
  @JoinColumn({ name: 'section_id' })
  section: string;

  @Column({ nullable: false, type: 'uuid' })
  createdBy: string;

  @Column({ nullable: false, type: 'uuid' })
  updatedBy: string;
}
