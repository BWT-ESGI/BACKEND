import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { User } from '../users/entities/user.entity';
import { Deliverable } from '../deliverable/entities/deliverable.entity';
import { Submission } from '../submission/entities/submission.entity';
import { Group } from '../group/entities/group.entity';
import { EvaluationGrid } from '../evaluation/entities/evaluation-grid.entity';
import { CriteriaSet } from '../evaluation/entities/criteria-set.entity';
import { Criteria } from '../evaluation/entities/criteria.entity';
import { Project } from '../project/entities/project.entity';
import { EvaluationModule } from '../evaluation/evaluation.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Deliverable,
      Submission,
      Group,
      EvaluationGrid,
      CriteriaSet,
      Criteria,
      Project,
    ]),
    forwardRef(() => EvaluationModule),
    forwardRef(() => ProjectModule),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
