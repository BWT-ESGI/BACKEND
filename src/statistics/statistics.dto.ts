// DTO pour d'éventuels paramètres de requête ou de réponse (exemple de base)
export class GetProjectStatsDto {
  projectId: string;
}

export class GroupGradeDto {
  groupId: string;
  groupName: string;
  grade: number;
}

export class ProjectStatsResponseDto {
  totalDeliverables: number;
  totalSubmissions: number;
  lateSubmissions: number;
  gradesCount: number;
  averageGrade: number | null;
  medianGrade: number | null;
  groupGrades: GroupGradeDto[];
}
