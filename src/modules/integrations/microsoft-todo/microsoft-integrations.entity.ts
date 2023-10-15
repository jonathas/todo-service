import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'microsoft_integrations' })
export class MicrosoftIntegrations {
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

  @Column('varchar', { name: 'username', nullable: false })
  public username: string;

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
}
