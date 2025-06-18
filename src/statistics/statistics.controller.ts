import { Controller, Get, Param } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('project/:projectId')
  async getProjectStats(@Param('projectId') projectId: string) {
    return this.statisticsService.getProjectStats(projectId);
  }
}
