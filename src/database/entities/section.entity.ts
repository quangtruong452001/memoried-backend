import {
  Entity,
  Column,
  OneToMany,
  Index,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Images } from './images.entity';
import { Note } from './note.entity';
import { Blog } from './blog.entity';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class Section extends AbstractEntity<Section> {
  @PrimaryGeneratedColumn('uuid', {
    name: 'section_id',
  })
  @Index()
  id: number;

  @Column({ nullable: false, type: 'uuid' })
  blog_id: string;

  @Column({ nullable: false })
  caption: string;

  @OneToMany(() => Images, (images) => images.section)
  section_image: 'uuid';

  @OneToMany(() => Note, (note) => note.section)
  section_note: 'uuid';

  @ManyToOne(() => Blog, (blog) => blog.blog_section)
  @JoinColumn({ name: 'blog_id' })
  blog: number;
}
