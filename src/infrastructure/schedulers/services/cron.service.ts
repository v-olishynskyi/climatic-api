import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronCommand, CronJob } from 'cron';

@Injectable()
export class CronService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  @Cron('30 * * * * *')
  test__30secWeatherUpdateCronJob() {
    console.log('Hourly weather update cron job executed');
  }

  @Cron('0 07 * * *')
  hourlyWeatherUpdateCronJob() {
    console.log('Hourly weather update cron job executed');
  }

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
