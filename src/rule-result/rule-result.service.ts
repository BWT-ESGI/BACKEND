import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RuleResult } from './entities/rule-result.entity';

@Injectable()
export class RuleResultService {
  constructor(
    @InjectRepository(RuleResult)
    private readonly resultRepo: Repository<RuleResult>,
  ) {}

  create(result: Partial<RuleResult>): Promise<RuleResult> {
    const entity = this.resultRepo.create(result);
    return this.resultRepo.save(entity);
  }

  findBySubmission(submissionId: string): Promise<RuleResult[]> {
    return this.resultRepo.find({ where: { submissionId } });
  }

  findByRule(ruleId: string): Promise<RuleResult[]> {
    return this.resultRepo.find({ where: { ruleId } });
  }
}