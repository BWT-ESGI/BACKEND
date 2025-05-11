import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { DeliverableService } from '@/deliverable/deliverable.service';
import { MinioService } from '@/minio/minio.service';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
    private readonly deliverableService: DeliverableService,
    private readonly minioService: MinioService,
  ) {}

  async create(dto: CreateSubmissionDto, fileBuffer?: Buffer, fileName?: string, fileSize?: number): Promise<Submission> {
    const deliverable = await this.deliverableService.findOne(dto.deliverableId);
    const submission = this.submissionRepository.create(dto);

    submission.deliverable = deliverable;
    submission.deliverableId = dto.deliverableId;
    submission.groupId = dto.groupId;
    submission.submittedAt = new Date();

    // Late logic
    submission.isLate = submission.submittedAt > deliverable.deadline;
    if (submission.isLate && !deliverable.allowLateSubmission) {
      throw new Error('Soumission tardive non autorisée');
    }
    submission.penaltyApplied = submission.isLate
      ? ((submission.submittedAt.getTime() - deliverable.deadline.getTime()) / 1000 / 3600) * deliverable.penaltyPerHourLate
      : 0;

    // Storage
    if (fileBuffer && fileName) {
      const objectName = `submissions/${submission.id}/${fileName}`;
      await this.minioService.upload('archives', objectName, fileBuffer, fileSize);
      submission.archiveObjectName = objectName;
    } else if (dto.gitRepoUrl) {
      submission.gitRepoUrl = dto.gitRepoUrl;
    }

    return this.submissionRepository.save(submission);
  }

  findAll(): Promise<Submission[]> {
    return this.submissionRepository.find();
  }

  findOne(id: string): Promise<Submission> {
    return this.submissionRepository.findOne({ where: { id } });
  }

  async findByDeliverable(deliverableId: string): Promise<Submission[]> {
    return this.submissionRepository.find({ where: { deliverableId } });
  }

  async update(id: string, dto: UpdateSubmissionDto): Promise<Submission> {
    await this.submissionRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.submissionRepository.delete(id);
  }
}