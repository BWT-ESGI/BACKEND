import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = this.groupRepository.create(createGroupDto);
    return await this.groupRepository.save(group);
  }

  async findAll(): Promise<Group[]> {
    return await this.groupRepository.find();
  }

  async findOne(id: number): Promise<Group> {
    const group = await this.groupRepository.findOne({ where: { id: id.toString() } });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<Group> {
    await this.findOne(id);
    await this.groupRepository.update(id, updateGroupDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.groupRepository.delete(id);
  }
}