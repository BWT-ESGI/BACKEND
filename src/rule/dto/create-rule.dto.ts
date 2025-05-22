import { IsUUID, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { RuleType } from '../entities/rule.entity';

export class CreateRuleDto {
  @IsUUID()
  deliverableId: string;

  @IsEnum(RuleType)
  type: RuleType;

  @IsObject()
  config: Record<string, any>;

  @IsOptional()
  @IsString()
  preset?: string;
}