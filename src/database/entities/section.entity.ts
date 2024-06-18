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
  id: string;

  @Column({ nullable: false })
  caption: string;

  @ManyToOne(() => Blog, (blog) => blog.blog_section)
  @JoinColumn({ name: 'blog_id' })
  blog: string;

  @OneToMany(() => Images, (images) => images.section)
  section_image: Images[];

  @OneToMany(() => Note, (note) => note.section)
  section_note: Note[];

  @Column({ nullable: false, type: 'uuid' })
  createdBy: string;

  @Column({ nullable: false, type: 'uuid' })
  updatedBy: string;
}
