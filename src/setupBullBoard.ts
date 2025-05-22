import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queue } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { QueueNamesEnum, QueuePrefixEnum } from './queues/enum';

export default function setupBullBoard(app) {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  const connection = {
    host: process.env.REDIS_HOST,
    port: +(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD,
    ...(process.env.NODE_ENV === 'production' ? { tls: {} } : {}),
  };

  const queues = [
    new BullMQAdapter(
      new Queue(QueueNamesEnum.MAIL_CONFIRMATION, {
        connection,
        prefix: QueuePrefixEnum.MAIL_CONFIRMATION,
      }),
    ),
    new BullMQAdapter(
      new Queue(QueueNamesEnum.MAIL_WEATHER_HOURLY, {
        connection,
        prefix: QueuePrefixEnum.MAIL_WEATHER_HOURLY,
      }),
    ),
    new BullMQAdapter(
      new Queue(QueueNamesEnum.MAIL_WEATHER_DAILY, {
        connection,
        prefix: QueuePrefixEnum.MAIL_WEATHER_DAILY,
      }),
    ),
  ];

  createBullBoard({
    queues,
    serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());
}
