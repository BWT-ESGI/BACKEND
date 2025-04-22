import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Defense } from './entities/defense.entity';
import { CreateDefenseDto } from './dto/create-defense.dto';
import { UpdateDefenseDto } from './dto/update-defense.dto';
import { Group } from '@/group/entities/group.entity';

@Injectable()
export class DefenseService {
  constructor(
    @InjectRepository(Defense)
    private readonly defenseRepo: Repository<Defense>,
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
  ) {}

  async create(groupId: string, dto: CreateDefenseDto): Promise<Defense> {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException(`Groupe #${groupId} introuvable`);
    }
    const defense = this.defenseRepo.create({ ...dto, group });
    return this.defenseRepo.save(defense);
  }

  async findAllByGroup(groupId: string): Promise<Defense[]> {
    return this.defenseRepo.find({
      where: { group: { id: groupId } },
      order: { start: 'ASC' },
    });
  }

  async update(id: string, dto: UpdateDefenseDto): Promise<Defense> {
    const defense = await this.defenseRepo.preload({ id, ...dto });
    if (!defense) {
      throw new NotFoundException(`Soutenance #${id} introuvable`);
    }
    return this.defenseRepo.save(defense);
  }

  async remove(id: string): Promise<void> {
    const result = await this.defenseRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Soutenance #${id} introuvable`);
    }
  }
}
