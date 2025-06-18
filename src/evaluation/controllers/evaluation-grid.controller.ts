import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EvaluationGridService } from '../services/evaluation-grid.service';
import { CreateEvaluationGridDto } from '../dto/create-evaluation-grid.dto';

@Controller('evaluation-grids')
export class EvaluationGridController {
  constructor(private readonly evaluationGridService: EvaluationGridService) {}

  @Post()
  create(@Body() dto: CreateEvaluationGridDto) {
    return this.evaluationGridService.create(dto);
  }

  @Get()
  findOne(
    @Query('criteriaSetId') criteriaSetId: string,
    @Query('groupId') groupId: string,
    @Query('deliverableId') deliverableId?: string,
    @Query('defenseId') defenseId?: string,
    @Query('reportId') reportId?: string,
  ) {
    return this.evaluationGridService.findOne(criteriaSetId, groupId, deliverableId, defenseId, reportId);
  }
}
