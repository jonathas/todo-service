import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { Lists } from '../../lists/lists.entity';
import { Tasks } from './tasks.entity';

@Entity('tasks_lists')
export class TasksLists {
  @PrimaryColumn('int', { name: 'task_id', unsigned: true })
  public taskId: number;

  @PrimaryColumn('int', { name: 'list_id' })
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
  @JoinColumn([{ name: 'task_id', referencedColumnName: 'id' }])
  public task: Tasks;

  @ManyToOne(() => Lists, (lists) => lists.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn([{ name: 'list_id', referencedColumnName: 'id' }])
  public list: Lists;
}
