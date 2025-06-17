import { IsNotEmpty, IsOptional, IsString, IsNumber, IsIn } from 'class-validator';

export class CreateCriteriaSetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  groupId?: string;

  @IsNumber()
  weight: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['defense', 'deliverable', 'report'])
  type: 'defense' | 'deliverable' | 'report';
}
