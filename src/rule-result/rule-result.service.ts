import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RuleResult } from './entities/rule-result.entity';
import { Submission } from '../submission/entities/submission.entity';
import { Deliverable } from '../deliverable/entities/deliverable.entity';

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

  findByProject(projectId: string): Promise<RuleResult[]> {
    console.log('Recherche des RuleResults pour le projet:', projectId);
    // On doit d'abord récupérer les deliverables du projet
    // puis les submissions de ces deliverables
    // puis les RuleResults de ces submissions
    return this.resultRepo.manager.transaction(async (manager) => {
      const deliverables = await manager.find(Deliverable, { where: { projectId } });
      const deliverableIds = deliverables.map(d => d.id);
      if (deliverableIds.length === 0) return [];
      const submissions = await manager.find(Submission, { where: { deliverableId: In(deliverableIds) } });
      const submissionIds = submissions.map(s => s.id);
      if (submissionIds.length === 0) return [];
      return manager.find(RuleResult, {
        where: { submissionId: In(submissionIds) },
        relations: ["rule"]
      });
    });
  }
}