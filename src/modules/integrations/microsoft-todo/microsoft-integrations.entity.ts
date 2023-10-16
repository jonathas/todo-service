import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/base.entity';

@Entity({ name: 'microsoft_integrations' })
export class MicrosoftIntegrations extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column('text', { name: 'access_token', nullable: false })
  public accessToken: string | null;

  @Column('text', { name: 'id_token', nullable: false })
  public idToken: string | null;

  @Column('text', { name: 'refresh_token', nullable: false })
  public refreshToken: string | null;

  @Column('timestamp', { name: 'expires_on', nullable: false })
  public expiresOn: Date;

  @Column('int', { name: 'user_id', nullable: false })
  public userId: number;
}
