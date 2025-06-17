import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCriteriaDto {
  @IsString()
  @IsNotEmpty()
  criteriaSetId: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  maxScore: number;

  @IsNumber()
  weight: number;

  @IsString()
  @IsOptional()
  commentGlobal?: string;

  @IsString()
  @IsOptional()
  commentPerCriteria?: string;
}
