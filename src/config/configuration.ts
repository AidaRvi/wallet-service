export default () => ({
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  postgres_host: process.env.POSTGRESS_HOST,
  postgres_port: process.env.POSTGRESS_PORT,
  postgres_username: process.env.POSTGRESS_USERNAME,
  postgres_password: process.env.POSTGRESS_PASSWORD,
  postgres_database: process.env.POSTGRESS_DATABASE,
});
