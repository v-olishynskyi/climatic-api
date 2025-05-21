import { QUEUE_NAMES } from './constants';

export type QueueConnectionOptions = {
  name: string;
  db: number;
  prefix: string;
};

export type QueueConfig = Record<QUEUE_NAMES, QueueConnectionOptions>;
