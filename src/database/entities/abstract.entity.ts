import { CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

export class AbstractEntity<T> {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true, type: 'uuid' })
  createdBy: string;

  @Column({ nullable: true, type: 'uuid' })
  updatedBy: string;

  @Column({ nullable: true, type: 'boolean', default: false })
  isDeleted: boolean;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
