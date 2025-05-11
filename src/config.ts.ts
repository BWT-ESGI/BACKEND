import { registerAs } from '@nestjs/config';

import 'module-alias/register';

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

    minio: {
      host: process.env.MINIO_HOST,
      port: parseInt(process.env.MINIO_PORT, 10) || 9000,
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    },
  };
});
