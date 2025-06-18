import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EvaluationGrid } from '../entities/evaluation-grid.entity';
import { CreateEvaluationGridDto } from '../dto/create-evaluation-grid.dto';
import { User } from '@/users/entities/user.entity';
import { Project } from '@/project/entities/project.entity';
import { Criteria } from '../entities/criteria.entity';

@Injectable()
export class EvaluationGridService {
  constructor(
    @InjectRepository(EvaluationGrid)
    private readonly evaluationGridRepository: Repository<EvaluationGrid>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
    @InjectRepository(Criteria)
    private criteriaRepo: Repository<Criteria>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateEvaluationGridDto) {
    // On priorise deliverableId, defenseId, reportId pour l'unicité
    let where: any = { criteriaSetId: dto.criteriaSetId, groupId: dto.groupId };
    if (dto.deliverableId) where.deliverableId = dto.deliverableId;
    if (dto.defenseId) where.defenseId = dto.defenseId;
    if (dto.reportId) where.reportId = dto.reportId;
    const existing = await this.evaluationGridRepository.findOne({ where });
    if (existing) {
      existing.scores = dto.scores;
      existing.comments = dto.comments;
      existing.filledBy = dto.filledBy;
      return this.evaluationGridRepository.save(existing);
    }
    return this.evaluationGridRepository.save(dto);
  }

  findOne(criteriaSetId: string, groupId: string, deliverableId?: string, defenseId?: string, reportId?: string) {
    let where: any = { criteriaSetId, groupId };
    if (deliverableId) where.deliverableId = deliverableId;
    if (defenseId) where.defenseId = defenseId;
    if (reportId) where.reportId = reportId;
    return this.evaluationGridRepository.findOne({ where });
  }
}
