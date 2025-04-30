import { IsString, IsUUID, IsArray } from 'class-validator';

export class UpdateStudentsPromotionDto {
  @IsArray()
  @IsUUID("4", { each: true })
  ids: string[];
}