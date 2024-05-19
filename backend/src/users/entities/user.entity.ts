import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  emailVerification: boolean;

  @Column({ default: '' })
  verificationKey: string;

  @Column({ default: '' })
  phone: string;

  @Column('int', { array: true, default: [] })
  friendIds: number[];

  @Column({ default: '' })
  avatarBase64: string;

  @Column()
  username: string;

  @Column()
  passwordHash: string;

  @Column()
  publicKey: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastLoginDateTime: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastActiveDateTime: Date;

  @Column({ default: '' })
  accessToken: string;
}
