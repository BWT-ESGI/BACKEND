import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateEvaluationGridDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  criteriaSetId: string;

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
