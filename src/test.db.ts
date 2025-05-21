import { AppDataSource } from './infrastructure/database/typeorm.config';

AppDataSource.initialize()
  .then(() => {
    console.log('✅ DB connected');
  })
  .catch((err) => {
    console.error('❌ DB error', err);
  });
