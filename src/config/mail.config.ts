export default () => ({
  mail: {
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: parseInt(process.env.MAIL_PORT!, 10) || 587,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_FROM: process.env.MAIL_FROM,
  },
});
