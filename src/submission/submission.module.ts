import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { MinioService } from '@/minio/minio.service';
import { DeliverableModule } from '@/deliverable/deliverable.module';
import { MinioModule } from '@/minio/minio.module';
import { RuleModule } from '@/rule/rule.module';
import { RuleResultModule } from '@/rule-result/rule-result.module';
import { HttpModule } from '@nestjs/axios';
import { UpdateFileComparatorService } from './updateFileComparator.service';

@Module({
  imports: [HttpModule,TypeOrmModule.forFeature([Submission]), DeliverableModule, MinioModule, RuleModule, RuleResultModule],
  providers: [SubmissionService, MinioService, UpdateFileComparatorService],
  controllers: [SubmissionController],
  exports: [SubmissionService, UpdateFileComparatorService],
})
export class SubmissionModule { }