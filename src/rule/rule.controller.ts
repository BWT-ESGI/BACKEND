import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';

@Controller('rules')
export class RuleController {
  constructor(private readonly service: RuleService) {}

  @Post()
  create(@Body() dto: CreateRuleDto) {
    return this.service.create(dto);
  }

  @Get('deliverable/:id')
  findByDeliverable(@Param('id') id: string) {
    return this.service.findByDeliverable(id);
  }
}