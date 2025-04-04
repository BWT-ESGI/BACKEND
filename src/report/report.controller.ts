import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ReportService } from './report.service';
import { Report } from './entities/report.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async create(
    @Body('content') content: string,
    @Body('projectId') projectId: string,
  ): Promise<Report> {
    return this.reportService.create(content, projectId);
  }

  @Get()
  async findAll(): Promise<Report[]> {
    return this.reportService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Report> {
    return this.reportService.findOne(id);
  }
}