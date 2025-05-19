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
    // 1. Créer la soumission en base pour obtenir l'id
    let submission = this.submissionRepository.create({
      ...dto,
      deliverable,
      deliverableId: dto.deliverableId,
      groupId: dto.groupId,
      submittedAt: new Date(),
      isLate: false,
      penaltyApplied: 0,
    });
    submission.isLate = submission.submittedAt > deliverable.deadline;
    if (submission.isLate && !deliverable.allowLateSubmission) {
      throw new Error('Soumission tardive non autorisée');
    }
    submission.penaltyApplied = submission.isLate
      ? ((submission.submittedAt.getTime() - deliverable.deadline.getTime()) / 1000 / 3600) * deliverable.penaltyPerHourLate
      : 0;
    submission = await this.submissionRepository.save(submission);

    // 2. Uploader le fichier avec l'id réel
    if (fileBuffer && fileName) {
      const objectName = `submissions/${submission.id}/${fileName}`;
      await this.minioService.upload('bwt', objectName, fileBuffer, fileSize);
      submission.archiveObjectName = objectName;
      submission.filename = fileName;
      submission.size = fileSize;
      await this.submissionRepository.save(submission);
    } else if (dto.gitRepoUrl) {
      submission.gitRepoUrl = dto.gitRepoUrl;
      await this.submissionRepository.save(submission);
    }

    return submission;
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