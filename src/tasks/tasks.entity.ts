import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tasks', { schema: 'todo' })
export class Tasks {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column('varchar', { name: 'name', nullable: false, length: 255 })
  public name: string;

  @Column('varchar', { name: 'description', nullable: true, length: 255 })
  public description: string | null;

  @Column('boolean', { name: 'status' })
  public status: boolean;
}
