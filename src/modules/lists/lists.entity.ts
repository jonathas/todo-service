import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tasks } from '../tasks/tasks.entity';
import { BaseEntity } from '../../shared/base.entity';

@Entity()
export class Lists extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column('varchar', { name: 'name', nullable: false, length: 255, unique: true })
  public name: string;

  @Column('varchar', { name: 'description', nullable: true, length: 255 })
  public description: string | null;

  @Column('varchar', { name: 'ext_id', nullable: true, length: 255, unique: true })
  public extId: string | null;

  @Column('varchar', { name: 'ext_subscription_id', nullable: true, length: 255, unique: true })
  public extSubscriptionId: string | null;

  @Column('timestamp', { name: 'last_synced_at', nullable: true })
  public lastSyncedAt: Date;

  @OneToMany(() => Tasks, (tasks) => tasks.list)
  public tasks: Tasks[];
}
