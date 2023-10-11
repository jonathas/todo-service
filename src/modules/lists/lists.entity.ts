import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { TasksLists } from '../tasks/entities/tasks-lists.entity';

@Entity()
export class Lists {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column('varchar', { name: 'name', nullable: false, length: 255 })
  public name: string;

  @Column('varchar', { name: 'description', nullable: true, length: 255 })
  public description: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;

  @BeforeInsert()
  public insertCreated() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  public insertUpdated() {
    this.updatedAt = new Date();
  }

  @OneToMany(() => TasksLists, (tasksLists) => tasksLists.list)
  public taskLists: TasksLists[];
}
