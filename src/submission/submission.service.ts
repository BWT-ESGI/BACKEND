import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
  ) {}

  create(dto: CreateSubmissionDto): Promise<Submission> {
    const submission = this.submissionRepository.create(dto);
    return this.submissionRepository.save(submission);
  }

  findAll(): Promise<Submission[]> {
    return this.submissionRepository.find();
  }

  findOne(id: string): Promise<Submission> {
    return this.submissionRepository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateSubmissionDto): Promise<Submission> {
    await this.submissionRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.submissionRepository.delete(id);
  }
}