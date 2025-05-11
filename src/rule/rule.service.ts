import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rule } from './entities/rule.entity';
import { CreateRuleDto } from './dto/create-rule.dto';

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(Rule)
    private readonly ruleRepo: Repository<Rule>,
  ) {}

  create(dto: CreateRuleDto): Promise<Rule> {
    const entity = this.ruleRepo.create(dto);
    return this.ruleRepo.save(entity);
  }

  findByDeliverable(deliverableId: string): Promise<Rule[]> {
    return this.ruleRepo.find({ where: { deliverableId } });
  }
}