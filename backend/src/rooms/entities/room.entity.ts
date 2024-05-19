import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  avatarBase64: string;

  @Column()
  privateKey: string;

  @Column('int', { array: true })
  relatedIds: number[];

  @Column('int', { array: true })
  adminIds: number[];

  @Column({ default: false })
  readonly: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastActiveDateTime: Date;
}
