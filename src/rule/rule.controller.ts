import { Controller, Post, Get, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { COMMON_FILES, COMMON_ARCHITECTURES } from './rule-suggestions';

@ApiTags('Rules')
@Controller('rules')
export class RuleController {
  constructor(private readonly service: RuleService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new rule' })
  @ApiResponse({ status: 201, description: 'Rule created.' })
  create(@Body() dto: CreateRuleDto) {
    return this.service.create(dto);
  }

  @Get('deliverable/:id')
  @ApiOperation({ summary: 'Get rules by deliverable ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Rules for deliverable.' })
  findByDeliverable(@Param('id') id: string) {
    return this.service.findByDeliverable(id);
  }

  @Get('suggestions/files')
  getCommonFiles() {
    return COMMON_FILES;
  }

  @Get('suggestions/architectures')
  getCommonArchitectures() {
    return COMMON_ARCHITECTURES;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a rule' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Rule updated.' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}