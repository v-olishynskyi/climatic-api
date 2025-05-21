import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: +(process.env.REDIS_PORT ?? 6379),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
}));
