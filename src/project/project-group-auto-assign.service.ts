import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Project } from './entities/project.entity';
import { Group } from '@/group/entities/group.entity';
import { UsersHelperService } from '@/users/users-helper.service';

@Injectable()
export class ProjectGroupAutoAssignService {
  private readonly logger = new Logger(ProjectGroupAutoAssignService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly usersHelperService: UsersHelperService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleGroupAutoAssignment() {
    const now = new Date();
    const projects = await this.projectRepository.find({
      where: { deadlineGroupSelection: Not(IsNull()) },
      relations: ['groups', 'groups.members', 'promotion', 'promotion.students'],
    });
    for (const project of projects) {
      if (!project.deadlineGroupSelection) continue;
      const deadline = new Date(project.deadlineGroupSelection);
      const oneDayAfter = new Date(deadline.getTime() + 24 * 60 * 60 * 1000);
      if (now >= oneDayAfter) {
        const unassignedUsers = await this.usersHelperService.findUnassignedUsersForProject(project.id);
        if (unassignedUsers.length === 0) continue;
        const min = project.nbStudentsMinPerGroup || 1;
        const max = project.nbStudentsMaxPerGroup || 99;
        // Remplir les groupes existants jusqu'à max
        let groups = project.groups || [];
        // 1. Remplissage des groupes existants
        for (const group of groups) {
          while (group.members.length < max && unassignedUsers.length > 0) {
            // Préférence: TODO (si tu veux gérer des préférences, insère ici)
            group.members.push(unassignedUsers.shift());
          }
        }
        // 2. Si des users restent, création de nouveaux groupes aléatoires
        let groupIndex = groups.length + 1;
        while (unassignedUsers.length > 0) {
          const newGroupMembers = unassignedUsers.splice(0, max);
          const newGroup = this.groupRepository.create({
            name: `Groupe ${groupIndex++}`,
            project: project,
            members: newGroupMembers,
          });
          await this.groupRepository.save(newGroup);
        }
        // Sauvegarder les groupes modifiés
        for (const group of groups) {
          await this.groupRepository.save(group);
        }
        this.logger.log(`Projet ${project.name}: Attribution automatique terminée.`);
      }
    }
  }
}
