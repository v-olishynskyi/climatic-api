// src/infrastructure/bull-board/bull-board.controller.ts

import { Controller, Get, Req, Res } from '@nestjs/common';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import { Request, Response } from 'express';
import { AppConfigService } from '../../../config/shared-config.service';
import { QUEUE_NAMES } from '../../constants';

@Controller('/admin/queues')
export class BullBoardController {
  private readonly serverAdapter = new ExpressAdapter();

  constructor(private readonly config: AppConfigService) {
    const connection = {
      host: config.get('redis.REDIS_HOST'),
      port: config.get('redis.REDIS_PORT'),
      password: config.get('redis.REDIS_PASSWORD'),
      tls: {},
    };

    const queues = [
      new BullMQAdapter(
        new Queue(QUEUE_NAMES.MAIL_CONFIRMATION, { connection }),
      ),
      new BullMQAdapter(
        new Queue(QUEUE_NAMES.MAIL_WEATHER_HOURLY, { connection }),
      ),
      new BullMQAdapter(
        new Queue(QUEUE_NAMES.MAIL_WEATHER_DAILY, { connection }),
      ),
    ];

    createBullBoard({
      queues,
      serverAdapter: this.serverAdapter,
    });

    this.serverAdapter.setBasePath('/queues');
  }

  @Get('*')
  handler(@Req() req: Request, @Res() res: Response) {
    this.serverAdapter.getRouter()(req, res);
  }
}
