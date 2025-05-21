export default () => ({
  pg: {
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: +(process.env.POSTGRES_PORT ?? 5432),
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DB: process.env.POSTGRES_DB,
  },
});
