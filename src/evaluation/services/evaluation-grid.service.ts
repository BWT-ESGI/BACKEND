import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluationGrid } from '../entities/evaluation-grid.entity';
import { CreateEvaluationGridDto } from '../dto/create-evaluation-grid.dto';

@Injectable()
export class EvaluationGridService {
  constructor(
    @InjectRepository(EvaluationGrid)
    private readonly evaluationGridRepository: Repository<EvaluationGrid>,
  ) {}

  async create(dto: CreateEvaluationGridDto) {
    const existing = await this.evaluationGridRepository.findOne({ where: { criteriaSetId: dto.criteriaSetId, groupId: dto.groupId } });
    if (existing) {
      // Met à jour les champs modifiables
      existing.scores = dto.scores;
      existing.comments = dto.comments;
      existing.filledBy = dto.filledBy;
      return this.evaluationGridRepository.save(existing);
    }
    return this.evaluationGridRepository.save(dto);
  }

  findOne(criteriaSetId: string, groupId: string) {
    return this.evaluationGridRepository.findOne({ where: { criteriaSetId, groupId } });
  }
}
