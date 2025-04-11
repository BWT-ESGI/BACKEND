import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Submission])],
  providers: [SubmissionService],
  controllers: [SubmissionController],
  exports: [SubmissionService],
})
export class SubmissionModule {}