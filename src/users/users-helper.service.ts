import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Group } from '@/group/entities/group.entity';
import { Project } from '@/project/entities/project.entity';

@Injectable()
export class UsersHelperService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findUnassignedUsersForProject(projectId: string): Promise<User[]> {
    // Récupérer le projet avec la promotion et les groupes
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['promotion', 'promotion.students', 'groups', 'groups.members'],
    });
    if (!project || !project.promotion) return [];
    const allStudents = project.promotion.students;
    const assignedUserIds = new Set(
      (project.groups || []).flatMap((g) => (g.members || []).map((u) => u.id))
    );
    return allStudents.filter((u) => !assignedUserIds.has(u.id));
  }
}
