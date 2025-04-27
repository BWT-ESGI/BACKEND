import { IsString, IsUUID, IsArray } from 'class-validator';

export class CreateNotationGridDto {
  @IsArray()
  @IsUUID("4", { each: true })
  ids: string[];
}