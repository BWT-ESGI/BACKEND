import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity';
import { Promotion } from '@/promotion/entities/promotion.entity';
import { Group } from '@/group/entities/group.entity';
import { Report } from '@/report/entities/report.entity';
import { ProjectGroupAutoAssignService } from './project-group-auto-assign.service';
import { UsersModule } from '@/users/users.module';
import { ProjectComparatorTriggerService } from './projectComparatorTriggerService';
import { SubmissionModule } from '@/submission/submission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Promotion, Group, Report]), UsersModule, SubmissionModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectGroupAutoAssignService, ProjectComparatorTriggerService],
  exports: [ProjectService],
})
export class ProjectModule {}