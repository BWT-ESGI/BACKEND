import { IsString, IsDateString, IsEnum } from 'class-validator';
import { Month } from '../enums/month.enum';


export class CreateDefenseDto {
  @IsString()
  name: string;

  @IsDateString()
  start: string;

  @IsDateString()
  end: string;

  @IsEnum(Month)
  month: Month;
}