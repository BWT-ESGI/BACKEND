import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OverallGrade } from '../entities/overall-grade.entity';
import { CreateOverallGradeDto } from '../dto/create-overall-grade.dto';

@Injectable()
export class OverallGradeService {
  constructor(
    @InjectRepository(OverallGrade)
    private readonly overallGradeRepository: Repository<OverallGrade>,
  ) {}

  create(dto: CreateOverallGradeDto) {
    return this.overallGradeRepository.save(dto);
  }

  findOne(projectId: string, studentId: string) {
    return this.overallGradeRepository.findOne({ where: { projectId, computedBy: studentId } });
  }
}
