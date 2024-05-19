import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: number;

  @Column()
  ownerId: number;

  @Column({ default: 0 })
  replied_to_message_id: number;

  @Column()
  crypted: boolean;

  @Column()
  payload: string;

  @Column('int', { array: true })
  viewedIds: number[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  lastEditDateTime: Date;
}
