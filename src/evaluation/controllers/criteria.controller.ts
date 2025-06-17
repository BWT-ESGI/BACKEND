import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CriteriaService } from '../services/criteria.service';
import { CreateCriteriaDto } from '../dto/create-criteria.dto';

@Controller('criteria')
export class CriteriaController {
  constructor(private readonly criteriaService: CriteriaService) {}

  @Post()
  create(@Body() dto: CreateCriteriaDto) {
    return this.criteriaService.create(dto);
  }

  @Get()
  findAll(@Query('criteriaSetId') criteriaSetId: string) {
    return this.criteriaService.findAll(criteriaSetId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateCriteriaDto>) {
    return this.criteriaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.criteriaService.remove(id);
  }
}
