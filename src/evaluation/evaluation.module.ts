import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriteriaSet } from './entities/criteria-set.entity';
import { Criteria } from './entities/criteria.entity';
import { EvaluationGrid } from './entities/evaluation-grid.entity';
import { OverallGrade } from './entities/overall-grade.entity';
import { CriteriaSetService } from './services/criteria-set.service';
import { CriteriaService } from './services/criteria.service';
import { EvaluationGridService } from './services/evaluation-grid.service';
import { OverallGradeService } from './services/overall-grade.service';
import { CriteriaSetController } from './controllers/criteria-set.controller';
import { CriteriaController } from './controllers/criteria.controller';
import { EvaluationGridController } from './controllers/evaluation-grid.controller';
import { OverallGradeController } from './controllers/overall-grade.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CriteriaSet, Criteria, EvaluationGrid, OverallGrade])],
  providers: [CriteriaSetService, CriteriaService, EvaluationGridService, OverallGradeService],
  controllers: [CriteriaSetController, CriteriaController, EvaluationGridController, OverallGradeController],
})
export class EvaluationModule {}
