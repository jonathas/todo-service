import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../../shared/base.entity';

@Entity()
export class Subscriptions extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column('varchar', { name: 'subscription_id', nullable: false, length: 255 })
  public subscriptionId: string;

  @Column('varchar', { name: 'resource', nullable: false, length: 255 })
  public resource: string;

  @Column('varchar', { name: 'ext_list_id', nullable: false, length: 255 })
  public extListId: string;

  @Column('timestamp', { name: 'expiration_date_time', nullable: false })
  public expirationDateTime: Date;
}
