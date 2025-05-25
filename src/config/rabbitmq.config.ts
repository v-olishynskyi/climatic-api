import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  RABBITMQ_HOST: process.env.RABBITMQ_HOST,
  RABBITMQ_USER: process.env.RABBITMQ_USER,
  RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD,
}));
