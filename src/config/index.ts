export default () => ({
  env: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET ?? '',
  },
  port: parseInt(process.env.PORT ?? '3000', 10),
  appName: process.env.APP_NAME,
  saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
});
