import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  name: string;

  teacherId: string;

  @IsOptional()
  studentIds?: string[];
}