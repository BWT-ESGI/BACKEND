import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioService } from './minio.service';

@Module({
  imports: [TypeOrmModule.forFeature()],
  controllers: [],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
