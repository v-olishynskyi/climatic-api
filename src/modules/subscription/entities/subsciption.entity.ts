import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FrequencyUpdatesEnum } from '../enum';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  city: string;

  @Column()
  email: string;

  @Column({ type: 'varchar', nullable: true })
  subscribe_token: string | null;

  @Column()
  unsubscribe_token: string;

  @Column({ enum: FrequencyUpdatesEnum })
  frequency: FrequencyUpdatesEnum;
}
