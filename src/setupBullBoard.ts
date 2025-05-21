import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queue } from 'bullmq';
import { QUEUE_NAMES, QUEUE_PREFIX } from './queues/constants';
import { createBullBoard } from '@bull-board/api';

export default function setupBullBoard(app) {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  const connection = {
    host: process.env.REDIS_HOST,
    port: +(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD,
    // tls: {}, // або прибери, якщо не потрібне TLS
  };
  console.log(' setupBullBoard - connection:', connection);

  const queues = [
    new BullMQAdapter(
      new Queue(QUEUE_NAMES.MAIL_CONFIRMATION, {
        connection,
        prefix: QUEUE_PREFIX.MAIL_CONFIRMATION,
      }),
    ),
    new BullMQAdapter(
      new Queue(QUEUE_NAMES.MAIL_WEATHER_HOURLY, {
        connection,
        prefix: QUEUE_PREFIX.MAIL_WEATHER_HOURLY,
      }),
    ),
    new BullMQAdapter(
      new Queue(QUEUE_NAMES.MAIL_WEATHER_DAILY, {
        connection,
        prefix: QUEUE_PREFIX.MAIL_WEATHER_DAILY,
      }),
    ),
  ];

  createBullBoard({
    queues,
    serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());
}
