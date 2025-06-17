import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Criteria } from '../entities/criteria.entity';
import { CreateCriteriaDto } from '../dto/create-criteria.dto';

@Injectable()
export class CriteriaService {
  constructor(
    @InjectRepository(Criteria)
    private readonly criteriaRepository: Repository<Criteria>,
  ) {}

  create(dto: CreateCriteriaDto) {
    return this.criteriaRepository.save(dto);
  }

  findAll(criteriaSetId: string) {
    return this.criteriaRepository.find({ where: { criteriaSetId } });
  }

  update(id: string, dto: Partial<CreateCriteriaDto>) {
    return this.criteriaRepository.update(id, dto);
  }

  remove(id: string) {
    return this.criteriaRepository.delete(id);
  }
}
