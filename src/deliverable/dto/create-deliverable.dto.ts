import { IsString, IsBoolean, IsNumber, IsDateString, IsDate } from 'class-validator';

export class CreateDeliverableDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDate()
  deadline: Date;

  @IsBoolean()
  allowLateSubmission: boolean;

  @IsNumber()
  penaltyPerHourLate: number;

  @IsString()
  submissionType: 'archive' | 'git';

  @IsNumber()
  maxSize?: number; // En Mo
}