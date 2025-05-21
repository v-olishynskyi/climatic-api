import { QueueConfig } from './queue.types';

export enum QUEUE_NAMES {
  MAIL_WEATHER_DAILY = 'mail-weather-daily',
  MAIL_WEATHER_HOURLY = 'mail-weather-hourly',
  MAIL_CONFIRMATION = 'mail-confirmation',
}

export enum QUEUE_PREFIX {
  MAIL_WEATHER_DAILY = 'bullweatherdaily',
  MAIL_WEATHER_HOURLY = 'bullweatherhourly',
  MAIL_CONFIRMATION = 'bullmailconfirmation',
}

export enum QUEUE_DB {
  MAIL_WEATHER_DAILY = 2,
  MAIL_WEATHER_HOURLY = 1,
  MAIL_CONFIRMATION = 0,
}

export const QUEUE_CONFIG: QueueConfig = {
  [QUEUE_NAMES.MAIL_CONFIRMATION]: {
    name: QUEUE_NAMES.MAIL_CONFIRMATION,
    prefix: QUEUE_PREFIX.MAIL_CONFIRMATION,
    db: 0,
  },
  [QUEUE_NAMES.MAIL_WEATHER_HOURLY]: {
    name: QUEUE_NAMES.MAIL_WEATHER_HOURLY,
    prefix: QUEUE_PREFIX.MAIL_WEATHER_HOURLY,
    db: 0,
  },
  [QUEUE_NAMES.MAIL_WEATHER_DAILY]: {
    name: QUEUE_NAMES.MAIL_WEATHER_DAILY,
    prefix: QUEUE_PREFIX.MAIL_WEATHER_DAILY,
    db: 0,
  },
};
