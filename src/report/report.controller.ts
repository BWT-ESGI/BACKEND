import { Controller, Get, Post, Param, Body, Put } from '@nestjs/common';
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

  @Get('/by-project/:id')
  async findAllReportByProject(@Param('id') id: string): Promise<Report[]> {
    return this.reportService.findByProjectId(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('content') content: string,
  ): Promise<Report> {
    return this.reportService.update(id, content);
  }
}