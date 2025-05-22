import { QueueNamesEnum, QueuePrefixEnum } from './enum';
import { QueueConfig } from './queue.types';

export const QUEUE_CONFIG: QueueConfig = {
  [QueueNamesEnum.MAIL_CONFIRMATION]: {
    name: QueueNamesEnum.MAIL_CONFIRMATION,
    prefix: QueuePrefixEnum.MAIL_CONFIRMATION,
    db: 0,
  },
  [QueueNamesEnum.MAIL_WEATHER_HOURLY]: {
    name: QueueNamesEnum.MAIL_WEATHER_HOURLY,
    prefix: QueuePrefixEnum.MAIL_WEATHER_HOURLY,
    db: 0,
  },
  [QueueNamesEnum.MAIL_WEATHER_DAILY]: {
    name: QueueNamesEnum.MAIL_WEATHER_DAILY,
    prefix: QueuePrefixEnum.MAIL_WEATHER_DAILY,
    db: 0,
  },
};
