import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CriteriaSet } from '../entities/criteria-set.entity';
import { CreateCriteriaSetDto } from '../dto/create-criteria-set.dto';

@Injectable()
export class CriteriaSetService {
  constructor(
    @InjectRepository(CriteriaSet)
    private readonly criteriaSetRepository: Repository<CriteriaSet>,
  ) {}

  create(dto: CreateCriteriaSetDto) {
    return this.criteriaSetRepository.save(dto);
  }

  findAll(projectId?: string, groupId?: string, type?: string) {
    const where: any = {};
    if (projectId) where.groupId = projectId;
    if (groupId) where.groupId = groupId;
    if (type) where.type = type;
    return this.criteriaSetRepository.find({
      where,
      relations: ['criteria'],
    });
  }

  update(id: string, dto: Partial<CreateCriteriaSetDto>) {
    return this.criteriaSetRepository.update(id, dto);
  }

  remove(id: string) {
    return this.criteriaSetRepository.delete(id);
  }
}
