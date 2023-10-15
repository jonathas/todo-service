import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column({ type: 'varchar', name: 'email', length: 255, nullable: false })
  public email: string;

  @Column({ type: 'varchar', name: 'password', length: 255, nullable: true })
  public password: string;
}
