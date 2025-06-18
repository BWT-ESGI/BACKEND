import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EvaluationGrid } from '../entities/evaluation-grid.entity';
import { CreateEvaluationGridDto } from '../dto/create-evaluation-grid.dto';
import { User } from '@/users/entities/user.entity';
import { Project } from '@/project/entities/project.entity';
import { Criteria } from '../entities/criteria.entity';

@Injectable()
export class EvaluationGridService {
  constructor(
    @InjectRepository(EvaluationGrid)
    private readonly evaluationGridRepository: Repository<EvaluationGrid>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
    @InjectRepository(Criteria)
    private criteriaRepo: Repository<Criteria>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateEvaluationGridDto) {
    // On priorise deliverableId, defenseId, reportId pour l'unicité
    let where: any = { criteriaSetId: dto.criteriaSetId, groupId: dto.groupId };
    if (dto.deliverableId) where.deliverableId = dto.deliverableId;
    if (dto.defenseId) where.defenseId = dto.defenseId;
    if (dto.reportId) where.reportId = dto.reportId;
    const existing = await this.evaluationGridRepository.findOne({ where });
    if (existing) {
      existing.scores = dto.scores;
      existing.comments = dto.comments;
      existing.filledBy = dto.filledBy;
      return this.evaluationGridRepository.save(existing);
    }
    return this.evaluationGridRepository.save(dto);
  }

  findOne(criteriaSetId: string, groupId: string, deliverableId?: string, defenseId?: string, reportId?: string) {
    let where: any = { criteriaSetId, groupId };
    if (deliverableId) where.deliverableId = deliverableId;
    if (defenseId) where.defenseId = defenseId;
    if (reportId) where.reportId = reportId;
    return this.evaluationGridRepository.findOne({ where });
  }

  async getGradesDetailsForUser(user: User) {
    const userId = user.sub || user.id;

    // 1. Récupérer tous les projets où l’étudiant est dans la promotion
    const projects = await this.projectRepo
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.promotion', 'promotion')
      .leftJoinAndSelect('promotion.students', 'student')
      .where('student.id = :userId', { userId })
      .getMany();

    if (!projects.length) return [];

    const projectIds = projects.map((p) => p.id);

    // 2. Récupérer toutes les grilles liées à ces projets
    const grids = await this.evaluationGridRepository.find({
      where: projectIds.map((pid) => ({ projectId: pid })),
      order: { createdAt: 'DESC' },
    });

    if (!grids.length) return [];

    // 3. Pour chaque grille, enrichir avec infos du correcteur, projet et critères
    const filledByIds = Array.from(new Set(grids.map((g) => g.filledBy)));
    const correctors = await this.userRepo.findBy({ id: In(filledByIds) });
    const correctorMap = Object.fromEntries(
      correctors.map((u) => [u.id, u])
    );

    // Pour tous les critèresSets présents
    const allCriteriaSetIds = Array.from(new Set(grids.map((g) => g.criteriaSetId)));
    const allCriteria = await this.criteriaRepo.findBy({ criteriaSetId: In(allCriteriaSetIds) });
    // On regroupe par criteriaSetId
    const criteriaBySet: Record<string, Criteria[]> = {};
    allCriteria.forEach((crit) => {
      if (!criteriaBySet[crit.criteriaSetId]) criteriaBySet[crit.criteriaSetId] = [];
      criteriaBySet[crit.criteriaSetId].push(crit);
    });

    // 4. On enrichit la donnée
    const result = grids.map((g) => {
      const crits = criteriaBySet[g.criteriaSetId] || [];
      // Pour chaque critère, trouver la première key du score qui correspond à l’id du critère
      const firstScoreKey = Object.keys(g.scores)[0];
      const scoresWithCriteria = crits.map((crit) => ({
        criteriaId: crit.id,
        criteriaLabel: crit.label,
        score: g.scores[crit.id],
      }));

      return {
        ...g,
        projectId: g.projectId,
        project: projects.find((p) => p.id === g.projectId),
        corrector: correctorMap[g.filledBy]
          ? {
              id: correctorMap[g.filledBy].id,
              firstName: correctorMap[g.filledBy].firstName,
              lastName: correctorMap[g.filledBy].lastName,
            }
          : null,
        criteriaScores: scoresWithCriteria,
        firstScoreKey,
      };
    });

    return result;
  }
}
