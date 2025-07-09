import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Project } from './entities/project.entity';
import { UpdateFileComparatorService } from '../submission/updateFileComparator.service';
import { DateTime } from 'luxon';

@Injectable()
export class ProjectComparatorTriggerService {
  private readonly logger = new Logger(ProjectComparatorTriggerService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    private readonly updateFileComparatorService: UpdateFileComparatorService,
  ) {}

  /**
   * Toutes les minutes, on marque les projets dont endAt est dépassé
   * pour qu'ils déclenchent la comparaison.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleComparatorTrigger() {
    const nowParis = DateTime.now().setZone('Europe/Paris').toJSDate();

    const toTrigger = await this.projectRepo.find({
      where: {
        endAt: LessThan(nowParis),
        callComparatorService: false,
      },
    });

    if (toTrigger.length === 0) {
      return;
    }

    // 2) Pour chacun, passer callComparatorService à true
    for (const project of toTrigger) {
      project.callComparatorService = true;
      await this.projectRepo.save(project);

      this.updateFileComparatorService.sendSubmissionsToMicroservice(project.id);
      
      this.logger.log(`Projet ${project.id} — "${project.name}" marqué pour comparaison.`);
    }
  }
}