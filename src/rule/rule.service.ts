import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rule } from './entities/rule.entity';
import { CreateRuleDto } from './dto/create-rule.dto';

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(Rule)
    private readonly ruleRepo: Repository<Rule>,
  ) { }

  create(dto: CreateRuleDto): Promise<Rule> {
    const entity = this.ruleRepo.create(dto);
    if (dto.preset) entity.preset = dto.preset;
    return this.ruleRepo.save(entity);
  }

  findByDeliverable(deliverableId: string): Promise<Rule[]> {
    return this.ruleRepo.find({ where: { deliverableId } });
  }

  async update(id: string, dto: Partial<CreateRuleDto>): Promise<Rule> {
    const rule = await this.ruleRepo.findOne({ where: { id } });
    if (!rule) throw new Error('Rule not found');
    Object.assign(rule, dto);
    if (dto.preset !== undefined) rule.preset = dto.preset;
    return this.ruleRepo.save(rule);
  }

  async remove(id: string): Promise<void> {
    await this.ruleRepo.delete(id);
  }
}