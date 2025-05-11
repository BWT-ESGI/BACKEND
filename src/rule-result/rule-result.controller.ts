import { Controller, Get, Param } from '@nestjs/common';
import { RuleResultService } from './rule-result.service';

@Controller('rule-results')
export class RuleResultController {
  constructor(private readonly service: RuleResultService) {}

  @Get('submission/:id')
  findBySubmission(@Param('id') id: string) {
    return this.service.findBySubmission(id);
  }

  @Get('rule/:id')
  findByRule(@Param('id') id: string) {
    return this.service.findByRule(id);
  }
}