import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Deliverable } from '../deliverable/entities/deliverable.entity';
import { Submission } from '../submission/entities/submission.entity';
import { OverallGrade } from '../evaluation/entities/overall-grade.entity';
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
    @InjectRepository(OverallGrade)
    private readonly overallGradeRepository: Repository<OverallGrade>,
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
    ).filter((group) => Array.isArray(group.members) && group.members.length > 0);

    const groupStats = [] as Array<{
      groupId: string;
      groupName: string;
      defenseGrade: number | null;
      deliverableGrade: number | null;
      reportGrade: number | null;
      globalGrade: number | null;
    }>;

    for (const group of groups) {
      console.log(`\n--- Groupe ${group.name} (${group.id}) ---`);
      const grids = await this.evaluationGridRepository.find({
        where: { projectId, groupId: group.id },
      });

      // Initialisation des totaux par type
      const typeTotals: Record<
        string,
        { total: number; max: number; weight: number }
      > = {
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

      // Calcul des notes ramenées sur 20
      const calcGrade = (t: { total: number; max: number }) =>
        t.max > 0 ? (t.total * 20) / t.max : null;

      const defenseGrade = calcGrade(typeTotals.defense);
      const deliverableGrade = calcGrade(typeTotals.deliverable);
      const reportGrade = calcGrade(typeTotals.report);

      // Note globale pondérée
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

    // Calcul des stats globales
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

    // Variance & écart-type
    const variance = gradesCount
      ? globalGrades.reduce(
          (sum, g) => sum + Math.pow(g - averageGrade!, 2),
          0,
        ) / gradesCount
      : null;
    const stdDev = variance !== null ? Math.sqrt(variance) : null;

    // Quartiles et percentiles
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

    // Taux de réussite (>=10/20)
    const passedCount = gradesCount
      ? globalGrades.filter((g) => g >= 10).length
      : 0;
    const passRate = gradesCount ? (passedCount / gradesCount) * 100 : null;

    // Calcul des scores moyens par type de note (défense, livrable, rapport)
    const typeAverages: { defense?: number; deliverable?: number; report?: number } = {};
    ["defense", "deliverable", "report"].forEach(type => {
      const values = groupStats.map(g => g[`${type}Grade` as keyof typeof g]).filter((v): v is number => typeof v === 'number');
      typeAverages[type as keyof typeof typeAverages] = values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100 : undefined;
    });

    console.log('--- Fin du calcul des stats ---');

    return {
      deliverables: {
        total: deliverables.length,
        totalSubmissions: submissions.length,
        lateSubmissions: lateSubmissions.length,
      },
      grades: {
        gradesCount,
        average: averageGrade !== null ? Math.round(averageGrade * 100) / 100 : null,
        median: medianGrade !== null ? Math.round(medianGrade * 100) / 100 : null,
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
    };
  }
}
