import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RuleResultService } from './rule-result.service';

@ApiTags('Rule Results')
@Controller('rule-results')
export class RuleResultController {
  constructor(private readonly service: RuleResultService) { }

  @Get('submission/:id')
  @ApiOperation({ summary: 'Get rule results by submission ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Rule results for submission.' })
  findBySubmission(@Param('id') id: string) {
    return this.service.findBySubmission(id);
  }

  @Get('rule/:id')
  @ApiOperation({ summary: 'Get rule results by rule ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Rule results for rule.' })
  findByRule(@Param('id') id: string) {
    return this.service.findByRule(id);
  }
}