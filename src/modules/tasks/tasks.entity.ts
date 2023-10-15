import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lists } from '../lists/lists.entity';
import { BaseEntity } from '../../shared/base.entity';

@Entity()
export class Tasks extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column('varchar', { name: 'name', nullable: false, length: 255 })
  public name: string;

  @Column('varchar', { name: 'description', nullable: true, length: 255 })
  public description: string | null;

  @Column('boolean', { name: 'is_done', nullable: false, default: false })
  public isDone: boolean;

  @Column('int', { name: 'list_id', nullable: true })
  public listId: number;

  @Column('varchar', { name: 'ext_id', nullable: true, length: 255 })
  public extId: string | null;

  @OneToOne(() => Lists, (lists) => lists.tasks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn([{ name: 'list_id', referencedColumnName: 'id' }])
  public list: Lists;
}
