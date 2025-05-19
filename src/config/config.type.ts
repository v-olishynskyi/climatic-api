export interface AppConfig {
  jwt: {
    JWT_SECRET: string;
  };
  mail: {
    MAIL_HOST: string;
    MAIL_PORT: number;
    MAIL_USER: string;
    MAIL_PASSWORD: string;
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
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;
  };

  app: {
    API_URL: string;
    BULL_BOARD_PASSWORD: string;
  };
}
