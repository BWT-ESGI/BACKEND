import { registerAs } from '@nestjs/config';

import 'module-alias/register';

// Charger les variables d'environnement
// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST || 'db',
//   port: parseInt(process.env.DB_PORT, 10) || 5555,
//   username: process.env.DB_USERNAME || 'postgres',
//   password: process.env.DB_PASSWORD || 'pass123',
//   database: process.env.DB_NAME || 'postgres',
//   synchronize: false,
//   logging: true,
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],
//   migrations: [__dirname + '/migrations/*{.ts,.js}'],
// });

export default registerAs('config', () => {
  return {
    database: {
      port: process.env.BACKEND_PORT,
    },
    postgres: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      name: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USERNAME,
    },
  };
});
