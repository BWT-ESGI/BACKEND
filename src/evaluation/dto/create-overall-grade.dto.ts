import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateOverallGradeDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  computedBy: string;

  @IsNumber()
  grade: number;
}
