import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CriteriaSetService } from '../services/criteria-set.service';
import { CreateCriteriaSetDto } from '../dto/create-criteria-set.dto';

@Controller('criteria-sets')
export class CriteriaSetController {
  constructor(private readonly criteriaSetService: CriteriaSetService) {}

  @Post()
  create(@Body() dto: CreateCriteriaSetDto) {
    return this.criteriaSetService.create(dto);
  }

  @Get()
  findAll(
    @Query('projectId') projectId?: string,
    @Query('groupId') groupId?: string,
    @Query('type') type?: string,
  ) {
    return this.criteriaSetService.findAll(projectId, groupId, type);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateCriteriaSetDto>) {
    return this.criteriaSetService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.criteriaSetService.remove(id);
  }
}
