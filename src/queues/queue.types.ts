import { QueueNamesEnum } from './enum';

export type QueueConnectionOptions = {
  name: string;
  db: number;
  prefix: string;
};

export type QueueConfig = Record<QueueNamesEnum, QueueConnectionOptions>;
