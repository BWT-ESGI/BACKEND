import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SaveGroupDto {
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  projectId: string;

  @IsArray()
  memberIds: string[];
}