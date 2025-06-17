import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OverallGradeService } from '../services/overall-grade.service';
import { CreateOverallGradeDto } from '../dto/create-overall-grade.dto';

@Controller('overall-grade')
export class OverallGradeController {
  constructor(private readonly overallGradeService: OverallGradeService) {}

  @Post()
  create(@Body() dto: CreateOverallGradeDto) {
    return this.overallGradeService.create(dto);
  }

  @Get()
  findOne(@Query('projectId') projectId: string, @Query('studentId') studentId: string) {
    return this.overallGradeService.findOne(projectId, studentId);
  }
}
