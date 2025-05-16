import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronCommand, CronJob } from 'cron';

@Injectable()
export class CronService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  createAndStartCronTask(
    taskId: string,
    task: CronCommand<null, false>,
    frequency: string,
  ) {
    const job = new CronJob(frequency, task);

    this.schedulerRegistry.addCronJob(taskId, job);
    job.start();
  }
}
