import { IsString, IsBoolean, IsNumber, IsDateString } from 'class-validator';

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
}