import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
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

@Entity()
export class Section {
  @PrimaryGeneratedColumn('uuid', {
    name: 'section_id',
  })
  @Index()
  id: number;

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

  @OneToMany(() => Images, (images) => images.section)
  section_image: 'uuid';

  @OneToMany(() => Note, (note) => note.section)
  section_note: 'uuid';

  @ManyToOne(() => Blog, (blog) => blog.blog_section)
  @JoinColumn({ name: 'blog_id' })
  blog: number;
}
