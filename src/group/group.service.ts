import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Project } from '@/project/entities/project.entity';
import { User } from '@/users/entities/user.entity';
import { SaveGroupDto } from './dto/save-groups.dto';
import { Defense } from '@/defense/entities/defense.entity';
import { Month } from '@/defense/enums/month.enum';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Defense)
    private readonly defenseRepository: Repository<Defense>,
  ) {}

  async findByProjectId(projectId: string): Promise<Group[]> {
    return this.groupRepository.find({
      where: { project: { id: projectId } },
      relations: ['members', 'project'],
    });
  }

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = this.groupRepository.create(createGroupDto);
    return await this.groupRepository.save(group);
  }

  async findAll(): Promise<Group[]> {
    return await this.groupRepository.find();
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupRepository.findOne({ where: { id: id } });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    await this.findOne(id);
    await this.groupRepository.update(id, updateGroupDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.groupRepository.delete(id);
  }

  async leaveGroup(idGroup: string, id: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: idGroup },
      relations: ['members'],
    });
    if (!group) throw new NotFoundException('Group not found');
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException('User not found');
    group.members = group.members.filter((member) => member.id !== user.id);
    await this.groupRepository.save(group);
    return group;
  }

  async joinGroup(idGroup: string, id: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: idGroup },
      relations: ['members'],
    });
    if (!group) throw new NotFoundException('Group not found');
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException('User not found');
    group.members.push(user);
    await this.groupRepository.save(group);
    return group;
  }

  async findWithMembersAndDefenses(projectId: string): Promise<Group[]> {
    return this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'member')
      .leftJoinAndSelect('group.defense', 'defense')
      .where('group.projectId = :projectId', { projectId })
      .orderBy('defense.start', 'ASC')
      .getMany();
  }
}