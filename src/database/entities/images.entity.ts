import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Section } from './section.entity';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class Images extends AbstractEntity<Images> {
  @PrimaryGeneratedColumn('uuid')
  image_id: string;

  @Column({ nullable: false })
  url: string;

  @ManyToOne(() => Section, (section) => section.section_image)
  @JoinColumn({ name: 'section_id' })
  section: number;
}
