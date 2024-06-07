import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class Topic {
  @PrimaryColumn({ type: 'uuid' })
  topic_id: number;

  @Column({
    type: 'enum',
    enum: ['team', 'project'],
    nullable: false,
  })
  type: string;

  @Column({ nullable: false })
  topic_name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false, type: 'uuid' })
  createdBy: string;

  @Column({ nullable: false, type: 'uuid' })
  updatedBy: string;
}
