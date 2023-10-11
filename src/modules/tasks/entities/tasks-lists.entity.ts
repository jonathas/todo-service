import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Lists } from '../../lists/lists.entity';
import { Tasks } from './tasks.entity';

@Entity('tasks_lists')
export class TasksLists {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column('int', { name: 'task_id', unsigned: true })
  public taskId: number;

  @Column('int', { name: 'list_id' })
  public listId: number;

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

  @ManyToOne(() => Tasks, (tasks) => tasks.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public task: Tasks;

  @ManyToOne(() => Lists, (lists) => lists.createdAt, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn([{ name: 'skill_id', referencedColumnName: 'id' }])
  public list: Lists;
}
