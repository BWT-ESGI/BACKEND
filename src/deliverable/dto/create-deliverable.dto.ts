import { IsString, IsBoolean, IsNumber, IsDateString, ValidateIf, IsOptional } from 'class-validator';

export class CreateDeliverableDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  deadline: string;

  @IsBoolean()
  allowLateSubmission: boolean;

  @IsNumber()
  penaltyPerHourLate: number;

  @IsString()
  submissionType: 'archive' | 'git';

  @ValidateIf(o => o.submissionType === 'archive')
  @IsNumber()
  maxSize?: number; // En Mo

  @IsOptional()
  @IsString()
  criteriaSetId?: string;
}