import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  REDIS_EMAIL_HOST: process.env.REDIS_EMAIL_HOST,
  REDIS_EMAIL_PORT: process.env.REDIS_EMAIL_PORT,
}));
