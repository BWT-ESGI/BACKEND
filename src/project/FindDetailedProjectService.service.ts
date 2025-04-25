import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { Promotion } from '@/promotion/entities/promotion.entity';
import { Group } from '@/group/entities/group.entity';
import { Report } from '@/report/entities/report.entity';
import { User } from '@/users/entities/user.entity';
import { Role } from '@/users/enums/role.enum';
import { ProjectStatus } from './enums/project-status.enum';

@Injectable()
export class FindDetailedProjectService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async findOneDetailed(
    projectId: string,
    user: User,
  ): Promise<Project | null> {
    const userId = user.id;

    const qb = this.projectRepository
      .createQueryBuilder('project')
      .where('project.id = :projectId', { projectId })
      .andWhere('project.status != :draft', { draft: ProjectStatus.DRAFT })
      .leftJoinAndSelect('project.promotion', 'promotion');

    if (user.role === Role.Student) {
      // étudiant → on ne récupère que ses propres groupes
      qb.innerJoin(
        'project.groups',
        'group',
      )
        .innerJoinAndSelect(
          'group.members',
          'member',
          'member.id = :userId',
          { userId },
        );
    } else {
      // enseignant ou admin → on récupère tous les groupes
      qb.leftJoinAndSelect('project.groups', 'group')
        .leftJoinAndSelect('group.members', 'member');
    }

    // Dans les deux cas, on charge soutenances, rapports et évaluations pour les groupes sélectionnés
    qb.leftJoinAndSelect('group.defense', 'defense')
      .leftJoinAndSelect('group.reports', 'report')
      .leftJoinAndSelect('group.evaluations', 'evaluation')
      .distinct(true);

    return qb.getOne();
  }
}