import { Module, Global } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Client } from 'minio';
import { MinioService } from './minio.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'MINIO_CLIENT',
      useFactory: (config: ConfigService) => {
        return new Client({
          endPoint: config.get<string>('minio.host'),
          port: config.get<number>('minio.port'),
          useSSL: config.get<boolean>('minio.useSSL'),
          accessKey: config.get<string>('minio.accessKey'),
          secretKey: config.get<string>('minio.secretKey'),
        });
      },
      inject: [ConfigService],
    },
    MinioService,
  ],
  exports: ['MINIO_CLIENT', MinioService],
})
export class MinioModule {}