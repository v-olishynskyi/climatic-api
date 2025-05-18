import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { FrequencyUpdatesEnum } from '../enum';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  city: string;

  @Column()
  email: string;

  @Index({ unique: true })
  @Column()
  subscription_token: string;

  @Index()
  @Column({ enum: FrequencyUpdatesEnum })
  frequency: FrequencyUpdatesEnum;

  @Column({ default: false })
  subscribed: boolean;

  @Column({ name: 'unsubscribed_at', type: 'timestamp' })
  unsubscribed_at: Date;
}
