import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  createCronTask(taskId: string, task, frequency: string) {
    const job = new CronJob(frequency, task);

    this.schedulerRegistry.addCronJob(taskId, job);
    job.start();
  }
}
