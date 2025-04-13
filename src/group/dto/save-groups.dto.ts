import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SaveGroupDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  projectId: number;

  @IsArray()
  memberIds: number[];
}