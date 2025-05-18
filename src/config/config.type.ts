export interface AppConfig {
  jwt: {
    JWT_SECRET: string;
  };
  mail: {
    MAIL_HOST: string;
    MAIL_PORT: number;
    MAIL_USER: string;
    MAIL_PASS: string;
    MAIL_FROM: string;
  };
  pg: {
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
  };

  redis: {
    REDIS_EMAIL_HOST: string;
    REDIS_EMAIL_PORT: number;
    REDIS_EMAIL_PASSWORD: string;
  };

  API_URL: string;
}
