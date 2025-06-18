import { IsNotEmpty, IsString, IsObject, IsOptional } from 'class-validator';

export class CreateEvaluationGridDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  criteriaSetId: string;

  @IsOptional()
  @IsString()
  deliverableId?: string;

  @IsOptional()
  @IsString()
  defenseId?: string;

  @IsOptional()
  @IsString()
  reportId?: string;

  @IsString()
  @IsNotEmpty()
  filledBy: string;

  @IsObject()
  scores: Record<string, number>;

  @IsObject()
  comments: Record<string, string>;

  @IsString()
  @IsNotEmpty()
  groupId: string;
}
