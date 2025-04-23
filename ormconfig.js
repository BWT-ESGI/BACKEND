module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/entities/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  seeds: ['dist/db/seeds/*.js'],
  factories: ['dist/db/factories/*.js'],
  subscribers: ['dist/**/group/*.subscriber{.ts,.js}'],
  cli: {
    migrationsDir: 'db/migrations',
  },
  ssl: false,
};
