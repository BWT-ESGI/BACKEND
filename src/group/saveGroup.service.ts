// src/group/save-group.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { Project } from '@/project/entities/project.entity';
import { User } from '@/users/entities/user.entity';
import { SaveGroupDto } from './dto/save-groups.dto';
import { Defense } from '@/defense/entities/defense.entity';
import { Month } from '@/defense/enums/month.enum';

@Injectable()
export class SaveGroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Defense)
    private readonly defenseRepository: Repository<Defense>,
  ) { }

  async saveGroupsForProject(
    projectId: string,
    groupDtos: SaveGroupDto[],
  ): Promise<Group[]> {
    const project = await this.loadProject(projectId);

    const result: Group[] = [];
    for (const dto of groupDtos) {
      const users = await this.loadUsers(dto.memberIds);
      const group = await this.loadOrCreate(dto, project, users);
      const saved = await this.groupRepository.save(group);
      const full = await this.reloadFullGroup(saved.id);
      await this.syncDefenses(full);
      result.push(await this.reloadFullGroup(full.id));
    }

    return result;
  }

  private async loadProject(projectId: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }
    return project;
  }

  private async loadUsers(memberIds: string[]): Promise<User[]> {
    return this.userRepository.findByIds(memberIds);
  }

  private async loadOrCreate(
    dto: SaveGroupDto,
    project: Project,
    users: User[],
  ): Promise<Group> {
    if (dto.id) {
      const group = await this.groupRepository.findOne({
        where: { id: dto.id },
        relations: ['members', 'defense'],
      });
      if (!group) {
        throw new NotFoundException(`Group ${dto.id} not found`);
      }
      group.name = dto.name;
      group.members = users;
      return group;
    } else {
      return this.groupRepository.create({
        name: dto.name,
        project,
        members: users,
      });
    }
  }

  private async reloadFullGroup(id: string): Promise<Group> {
    const full = await this.groupRepository.findOne({
      where: { id },
      relations: ['members', 'defense'],
    });
    if (!full) {
      throw new NotFoundException(
        `Group ${id} not found after save`,
      );
    }
    return full;
  }

  private async syncDefenses(group: Group): Promise<void> {
    const hasMembers = group.members.length > 0;
    const existing = group.defense;
  
    if (hasMembers) {
      if (!existing) {
        const now = new Date();
        const monthNames = Object.values(Month) as Month[];
        const monthValue = monthNames[now.getMonth()];
  
        const def = this.defenseRepository.create({
          name: `${group.name} – Soutenance`,
          start: now,
          end: new Date(now.getTime() + 30 * 60000),
          month: monthValue,
          group,
        });
  
        const savedDef = await this.defenseRepository.save(def);
  
        group.defense = savedDef;
        await this.groupRepository.save(group);
      }
    } else {
      if (existing) {
        await this.defenseRepository.remove(existing);
      }
    }
  }
}