import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  name: string;

  @IsUUID()
  teacherId: string;

  @IsOptional()
  @IsUUID("all", { each: true })
  studentIds?: string[];

  @IsOptional()
  @IsUUID("all", { each: true })
  projectIds?: string[];
}