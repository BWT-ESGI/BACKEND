import { IsUUID, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateSubmissionDto {
  @IsUUID()
  deliverableId: string;

  @IsOptional()
  @IsUUID()
  groupId?: string;

  @IsOptional()
  @IsUUID()
  studentId?: string;

  @IsOptional()
  @IsString()
  archiveObjectName?: string; // clé MinIO

  @IsOptional()
  @IsString()
  gitRepoUrl?: string;

  @IsOptional()
  @IsBoolean()
  isLate?: boolean;
}