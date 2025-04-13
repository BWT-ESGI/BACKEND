import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Project } from '@/project/entities/project.entity';
import { User } from '@/users/entities/user.entity';
import { SaveGroupDto } from './dto/save-groups.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByProjectId(projectId: string): Promise<Group[]> {
    return this.groupRepository.find({
      where: { project: { id: parseInt(projectId, 10) } },
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

  async saveGroupsForProject(projectId: number, groupDtos: SaveGroupDto[]): Promise<Group[]> {
    const project = await this.projectRepository.findOneOrFail({ where: { id: projectId } });

    const savedGroups: Group[] = [];

    for (const dto of groupDtos) {
      const users = await this.userRepository.findByIds(dto.memberIds);

      let group: Group;

      if (dto.id) {
        // Update existing
        group = await this.groupRepository.findOneOrFail({
          where: { id: dto.id.toString() },
          relations: ['members'],
        });
        group.name = dto.name;
        group.members = users;
      } else {
        // Create new
        group = this.groupRepository.create({
          name: dto.name,
          project,
          members: users,
        });
      }

      const saved = await this.groupRepository.save(group);
      savedGroups.push(saved);
    }

    return savedGroups;
  }
}