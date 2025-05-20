import { Controller, Get, Post, Param, Body, Put } from '@nestjs/common';
import { ReportService } from './report.service';
import { Report } from './entities/report.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({ status: 201, description: 'Report created.' })
  async create(
    @Body('content') content: string,
    @Body('groupId') groupId: string,
  ): Promise<Report> {
    return this.reportService.create(content, groupId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  @ApiResponse({ status: 200, description: 'List of reports.' })
  async findAll(): Promise<Report[]> {
    return this.reportService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a report by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Report found.' })
  async findOne(@Param('id') id: string): Promise<Report> {
    return this.reportService.findOne(id);
  }

  @Get('/by-group/:id')
  @ApiOperation({ summary: 'Get all reports by group ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Reports for group.' })
  async findAllReportByGroup(@Param('id') id: string): Promise<Report[]> {
    return this.reportService.findByGroupId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a report by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Report updated.' })
  async update(
    @Param('id') id: string,
    @Body('content') content: string,
  ): Promise<Report> {
    return this.reportService.update(id, content);
  }
}