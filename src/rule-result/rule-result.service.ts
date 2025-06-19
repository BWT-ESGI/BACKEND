import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RuleResult } from './entities/rule-result.entity';

@Injectable()
export class RuleResultService {
  constructor(
    @InjectRepository(RuleResult)
    private readonly resultRepo: Repository<RuleResult>,
  ) { }

  create(result: Partial<RuleResult>): Promise<RuleResult> {
    console.log('Création d\'un RuleResult:', result);
    const entity = this.resultRepo.create(result);
    return this.resultRepo.save(entity);
  }

  async findAll(): Promise<RuleResult[]> {
    console.log('Récupération de tous les RuleResults');
    return this.resultRepo.find();
  }

  findBySubmission(submissionId: string): Promise<RuleResult[]> {
    console.log('Recherche des RuleResults pour la soumission:', submissionId);
    return this.resultRepo.find({ where: { submissionId } });
  }

  findByRule(ruleId: string): Promise<RuleResult[]> {
    console.log('Recherche des RuleResults pour la règle:', ruleId);
    return this.resultRepo.find({ where: { ruleId } });
  }
}