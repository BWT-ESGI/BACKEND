import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { MinioService } from '@/minio/minio.service';
import { DeliverableModule } from '@/deliverable/deliverable.module';
import { MinioModule } from '@/minio/minio.module';

@Module({
  imports: [TypeOrmModule.forFeature([Submission]), DeliverableModule, MinioModule],
  providers: [SubmissionService, MinioService], // Faudra ajouter le SubmissionProcessor ici 
  controllers: [SubmissionController],
  exports: [SubmissionService],
})
export class SubmissionModule {}