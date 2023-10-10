import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tasks', { schema: 'todo' })
export class Tasks {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column('text', { name: 'name', nullable: false })
  public name: string;

  @Column('text', { name: 'description', nullable: true })
  public description: string | null;

  @Column('int', { name: 'status' })
  public status: boolean;
}
