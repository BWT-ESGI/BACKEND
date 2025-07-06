import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UpdateFileComparatorService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
    private readonly httpService: HttpService,
  ) {}

  async sendSubmissionsToMicroservice(projectId: string): Promise<any> {
    const submissions = await this.submissionRepository.find({
      relations: ['group', 'deliverable'],
      where: {
        group: {
          project: {
            id: projectId,
          },
        },
      },
    });
    const data = submissions.map(sub => ({
      ...sub,
      projectId: projectId,
    }));

    const microserviceUrl =
      process.env.FILE_COMPARATOR_MICROSERVICE_URL || 'http://localhost:3004/compare';

    try {
      const response = this.httpService.post(microserviceUrl, { submissions: data });
      const result = await lastValueFrom(response);
      return result.data;
    } catch (error) {
      console.error('Error sending submissions to microservice:', error);
    }
  }
}