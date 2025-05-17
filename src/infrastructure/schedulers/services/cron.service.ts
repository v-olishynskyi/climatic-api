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

  async stopCronTask(taskId: string) {
    // Check if the task exists
    const isJobExists = this.schedulerRegistry.doesExist('cron', taskId);

    if (!isJobExists) {
      return true;
    }

    const job = this.schedulerRegistry.getCronJob(taskId);

    await job.stop();
    this.schedulerRegistry.deleteCronJob(taskId);

    return true;
  }
}
