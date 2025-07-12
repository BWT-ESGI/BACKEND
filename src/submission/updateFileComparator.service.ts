import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as http from 'http';

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

    console.log('[UpdateFileComparatorService] Submissions to send:', data);

    const microserviceUrl =
      process.env.FILE_COMPARATOR_MICROSERVICE_URL || 'http://localhost:3004/compare';

    console.log('[UpdateFileComparatorService] Microservice URL:', microserviceUrl);

    // Force IPv4 by using a custom http.Agent
    const agent = new http.Agent({ family: 4 });

    try {
      const response = this.httpService.post(
        microserviceUrl,
        { submissions: data },
        { httpAgent: agent }
      );
      const result = await lastValueFrom(response);
      console.log('[UpdateFileComparatorService] Microservice response:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error sending submissions to microservice:', error);
    }
  }
}