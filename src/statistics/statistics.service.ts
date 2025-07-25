import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Deliverable } from '../deliverable/entities/deliverable.entity';
import { Submission } from '../submission/entities/submission.entity';
import { Group } from '../group/entities/group.entity';
import { EvaluationGrid } from '../evaluation/entities/evaluation-grid.entity';
import { CriteriaSet } from '../evaluation/entities/criteria-set.entity';
import { Criteria } from '../evaluation/entities/criteria.entity';

@Injectable()
export class StatisticsService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Deliverable)
    private readonly deliverableRepository: Repository<Deliverable>,
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(EvaluationGrid)
    private readonly evaluationGridRepository: Repository<EvaluationGrid>,
    @InjectRepository(CriteriaSet)
    private readonly criteriaSetRepository: Repository<CriteriaSet>,
    @InjectRepository(Criteria)
    private readonly criteriaRepository: Repository<Criteria>,
  ) {}

  async onModuleInit() {}

  async getProjectStats(projectId: string) {
    const deliverables = await this.deliverableRepository.find({
      where: { projectId },
    });
    const deliverableIds = deliverables.map((d) => d.id);

    const submissions = deliverableIds.length
      ? await this.submissionRepository.find({
          where: deliverableIds.map((id) => ({ deliverableId: id })),
        })
      : [];

    const lateSubmissions = submissions.filter((s) => s.isLate);

    const groups = (
      await this.groupRepository.find({
        where: { project: { id: projectId } },
        relations: ['project', 'members'],
      })
    ).filter(
      (group) => Array.isArray(group.members) && group.members.length > 0,
    );

    const groupStats = [];

    for (const group of groups) {
      const grids = await this.evaluationGridRepository.find({
        where: { projectId, groupId: group.id },
      });

      const typeTotals = {
        defense: { total: 0, max: 0, weight: 0 },
        deliverable: { total: 0, max: 0, weight: 0 },
        report: { total: 0, max: 0, weight: 0 },
      };

      for (const grid of grids) {
        const criteriaSet = await this.criteriaSetRepository.findOne({
          where: { id: grid.criteriaSetId },
        });
        if (!criteriaSet) continue;

        const criteria = await this.criteriaRepository.find({
          where: { criteriaSetId: grid.criteriaSetId },
        });

        let gridTotal = 0;
        let gridMax = 0;

        for (const crit of criteria) {
          const score = grid.scores[crit.id] ?? 0;
          const critNote =
            crit.maxScore > 0 ? (score / crit.maxScore) * crit.weight : 0;
          gridTotal += critNote;
          gridMax += crit.weight;
        }

        if (criteriaSet.type in typeTotals) {
          typeTotals[criteriaSet.type].total += gridTotal * criteriaSet.weight;
          typeTotals[criteriaSet.type].max += gridMax * criteriaSet.weight;
          typeTotals[criteriaSet.type].weight = criteriaSet.weight;
        }
      }

      const calcGrade = (t: { total: number; max: number }) =>
        t.max > 0 ? (t.total * 20) / t.max : null;

      const defenseGrade = calcGrade(typeTotals.defense);
      const deliverableGrade = calcGrade(typeTotals.deliverable);
      const reportGrade = calcGrade(typeTotals.report);

      const totalWeight = Object.values(typeTotals).reduce(
        (acc, t) => acc + t.weight,
        0,
      );
      let globalGrade: number | null = null;
      if (totalWeight > 0) {
        let sum = 0;
        if (defenseGrade !== null)
          sum += defenseGrade * typeTotals.defense.weight;
        if (deliverableGrade !== null)
          sum += deliverableGrade * typeTotals.deliverable.weight;
        if (reportGrade !== null) sum += reportGrade * typeTotals.report.weight;
        globalGrade = sum / totalWeight;
      }

      groupStats.push({
        groupId: group.id,
        groupName: group.name,
        defenseGrade:
          defenseGrade !== null ? Math.round(defenseGrade * 100) / 100 : null,
        deliverableGrade:
          deliverableGrade !== null
            ? Math.round(deliverableGrade * 100) / 100
            : null,
        reportGrade:
          reportGrade !== null ? Math.round(reportGrade * 100) / 100 : null,
        globalGrade:
          globalGrade !== null ? Math.round(globalGrade * 100) / 100 : null,
      });
    }

    const globalGrades = groupStats
      .map((g) => g.globalGrade)
      .filter((g): g is number => typeof g === 'number');
    const gradesCount = globalGrades.length;

    const averageGrade = gradesCount
      ? globalGrades.reduce((a, b) => a + b, 0) / gradesCount
      : null;
    const sorted = [...globalGrades].sort((a, b) => a - b);
    const medianGrade = gradesCount
      ? sorted.length % 2 === 1
        ? sorted[(sorted.length - 1) / 2]
        : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : null;
    const minGrade = gradesCount ? Math.min(...globalGrades) : null;
    const maxGrade = gradesCount ? Math.max(...globalGrades) : null;
    const variance = gradesCount
      ? globalGrades.reduce(
          (sum, g) => sum + Math.pow(g - averageGrade!, 2),
          0,
        ) / gradesCount
      : null;
    const stdDev = variance !== null ? Math.sqrt(variance) : null;

    const percentile = (p: number) => {
      if (!gradesCount) return null;
      const idx = (gradesCount - 1) * p;
      const lo = Math.floor(idx);
      const hi = Math.ceil(idx);
      return lo === hi
        ? sorted[lo]
        : sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
    };

    const Q1 = percentile(0.25);
    const Q3 = percentile(0.75);
    const P90 = percentile(0.9);
    const passedCount = globalGrades.filter((g) => g >= 10).length;
    const passRate = gradesCount ? (passedCount / gradesCount) * 100 : null;

    const typeAverages = ['defense', 'deliverable', 'report'].reduce(
      (acc, type) => {
        const values = groupStats
          .map((g) => g[`${type}Grade` as keyof typeof g])
          .filter((v): v is number => typeof v === 'number');
        acc[type] = values.length
          ? Math.round(
              (values.reduce((a, b) => a + b, 0) / values.length) * 100,
            ) / 100
          : undefined;
        return acc;
      },
      {} as Record<string, number | undefined>,
    );

    const gradeDistribution = (() => {
      const bins = new Array(11).fill(0);
      for (const grade of globalGrades) {
        const index = Math.min(Math.floor(grade / 2), 10);
        bins[index]++;
      }
      return bins;
    })();

    return {
      deliverables: {
        total: deliverables.length,
        totalSubmissions: submissions.length,
        lateSubmissions: lateSubmissions.length,
      },
      grades: {
        gradesCount,
        average:
          averageGrade !== null ? Math.round(averageGrade * 100) / 100 : null,
        median:
          medianGrade !== null ? Math.round(medianGrade * 100) / 100 : null,
        min: minGrade,
        max: maxGrade,
        variance: variance !== null ? Math.round(variance * 100) / 100 : null,
        stdDev: stdDev !== null ? Math.round(stdDev * 100) / 100 : null,
        Q1: Q1 !== null ? Math.round(Q1 * 100) / 100 : null,
        Q3: Q3 !== null ? Math.round(Q3 * 100) / 100 : null,
        P90: P90 !== null ? Math.round(P90 * 100) / 100 : null,
        passRate: passRate !== null ? Math.round(passRate * 100) / 100 : null,
        groupGrades: groupStats,
        typeAverages,
      },
      submissionStats: {
        total: submissions.length,
        lateCount: lateSubmissions.length,
        lateRate: submissions.length
          ? Math.round((lateSubmissions.length / submissions.length) * 10000) /
            100
          : 0,
        averagePenalty: submissions.length
          ? Math.round(
              (submissions.reduce((a, b) => a + b.penaltyApplied, 0) /
                submissions.length) *
                100,
            ) / 100
          : null,
        averageFileSize: submissions.length
          ? Math.round(
              (submissions.reduce((a, b) => a + (Number(b.size) || 0), 0) /
                submissions.length /
                1024 /
                1024) *
                100,
            ) / 100
          : null,
        submissionTypeCount: {
          archive: submissions.filter((s) => !!s.archiveObjectName && !s.gitRepoUrl).length,
          fileUrl: submissions.filter((s) => !!s.fileUrl).length,
          gitRepo: submissions.filter((s) => !!s.gitRepoUrl).length,
        },
      },
      submissionTiming: {
        averageSubmissionDelayHours: submissions.length
          ? Math.round(
              (submissions
                .map((s) => {
                  const deliverable = deliverables.find(
                    (d) => d.id === s.deliverableId,
                  );
                  if (!deliverable) return 0;
                  const deadline = new Date(deliverable.deadline).getTime();
                  const submitted = new Date(s.submittedAt).getTime();
                  // On ne compte que le retard (0 si en avance)
                  return Math.max(0, (submitted - deadline) / (1000 * 60 * 60));
                })
                .reduce((a, b) => a + b, 0) /
                submissions.length) *
                100,
            ) / 100
          : null,
        submissionsJustBeforeDeadline: submissions.filter((s) => {
          const deliverable = deliverables.find(
            (d) => d.id === s.deliverableId,
          );
          if (!deliverable) return false;
          const deadline = new Date(deliverable.deadline).getTime();
          const submitted = new Date(s.submittedAt).getTime();
          const diffMinutes = (deadline - submitted) / (1000 * 60);
          return diffMinutes > 0 && diffMinutes <= 30;
        }).length,
      },
      deliverableBreakdown: deliverables.map((deliv) => {
        const related = submissions.filter((s) => s.deliverableId === deliv.id);
        const late = related.filter((s) => s.isLate).length;
        return {
          id: deliv.id,
          name: deliv.name,
          deadline: deliv.deadline,
          submissionCount: related.length,
          lateCount: late,
          lateRate: related.length
            ? Math.round((late / related.length) * 10000) / 100
            : 0,
        };
      }),
      groups: {
        total: groups.length,
        withGrades: groupStats.filter((g) => typeof g.globalGrade === 'number')
          .length,
      },
      gradeDistribution,
    };
  }

  /**
   * Retourne les notes détaillées et globales d'un utilisateur, triées par projet.
   * @param userId string
   */
  async getUserGrades(userId: string) {
    // 1. Trouver tous les groupes où l'utilisateur est membre
    const groups = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.project', 'project')
      .leftJoinAndSelect('group.members', 'member')
      .where('member.id = :userId', { userId })
      .getMany();
    // 2. Grouper par projet
    const projectsMap: Record<
      string,
      { projectId: string; projectName: string; grades: any[] }
    > = {};
    for (const group of groups) {
      const project = group.project;
      if (!project) continue;
      if (!projectsMap[project.id]) {
        projectsMap[project.id] = {
          projectId: project.id,
          projectName: project.name,
          grades: [],
        };
      }
      // 3. Récupérer toutes les grilles d'évaluation de ce groupe pour ce projet
      const grids = await this.evaluationGridRepository.find({
        where: { projectId: project.id, groupId: group.id },
      });
      for (const grid of grids) {
        // 4. Récupérer le criteriaSet et les critères
        const criteriaSet = await this.criteriaSetRepository.findOne({
          where: { id: grid.criteriaSetId },
        });
        if (!criteriaSet) continue;
        const criterias = await this.criteriaRepository.find({
          where: { criteriaSetId: criteriaSet.id },
        });
        // 5. Calculer la note globale de la grille
        let total = 0,
          max = 0;
        const details = criterias.map((crit) => {
          const score = grid.scores[crit.id] ?? 0;
          const note =
            crit.maxScore > 0 ? (score / crit.maxScore) * crit.weight : 0;
          total += note;
          max += crit.weight;
          return {
            criteriaId: crit.id,
            label: crit.label,
            score,
            maxScore: crit.maxScore,
            weight: crit.weight,
            note: crit.maxScore > 0 ? Math.round(note * 20 * 100) / 100 : null,
            comment: grid.comments[crit.id] || null,
          };
        });
        const global =
          max > 0 ? Math.round(((total * 20) / max) * 100) / 100 : null;
        projectsMap[project.id].grades.push({
          gridId: grid.id,
          criteriaSet: {
            id: criteriaSet.id,
            title: criteriaSet.title,
            type: criteriaSet.type,
          },
          details,
          global,
        });
      }
    }
    // 6. Retourner un tableau trié par projet
    return Object.values(projectsMap);
  }
}
