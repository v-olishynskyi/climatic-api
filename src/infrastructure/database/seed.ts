// src/infrastructure/database/seed.ts
import { runSeeders } from 'typeorm-extension';
import { AppDataSource } from './typeorm.config';

(async () => {
  await AppDataSource.initialize();
  await runSeeders(AppDataSource);
  await AppDataSource.destroy();
})();
