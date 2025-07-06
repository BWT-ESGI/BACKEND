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
import { Report } from '@/report/entities/report.entity';
import { Section } from '@/report/entities/section.entity';

@Injectable()
export class SaveGroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Defense)
    private readonly defenseRepo: Repository<Defense>,
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
    @InjectRepository(Section)
    private readonly sectionRepo: Repository<Section>,
  ) {}

  async saveGroupsForProject(
    projectId: string,
    dtos: SaveGroupDto[],
  ): Promise<Group[]> {
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);

    // 1) charger tous les anciens groupes AVEC membres et rapports
    const oldGroups = await this.groupRepo.find({
      where: { project: { id: projectId } },
      relations: ['members', 'report', 'report.sections'],
    });
    const oldMap = new Map<string, Group>(
      oldGroups.map(g => [g.id, g])
    );

    const result: Group[] = [];
    for (const dto of dtos) {
      const members = dto.memberIds?.length
        ? await this.userRepo.findByIds(dto.memberIds)
        : [];

      let group: Group;
      let membershipChanged = false;

      if (dto.id) {
        // --- mise à jour d’un groupe existant ---
        const g = await this.groupRepo.findOne({
          where: { id: dto.id },
          relations: ['members', 'report', 'report.sections'],
        });
        if (!g) throw new NotFoundException(`Group ${dto.id} not found`);

        // comparer membres
        const oldIds = g.members.map(u => u.id).sort();
        const newIds = dto.memberIds.slice().sort();
        membershipChanged = oldIds.length !== newIds.length
          || oldIds.some((id, i) => id !== newIds[i]);

        g.name = dto.name;
        g.members = members;
        group = await this.groupRepo.save(g);

      } else {
        // --- création d’un nouveau groupe ---
        const g = this.groupRepo.create({
          name: dto.name,
          project,
          members,
        });
        group = await this.groupRepo.save(g);
        membershipChanged = true; // nouveau = on doit créer un rapport
      }

      // 2) si la liste des membres a changé, supprimer l’ancien rapport  ses sections
      if (membershipChanged && group.report) {
        if (group.report.sections?.length) {
          await this.sectionRepo.remove(group.report.sections);
        }
        await this.reportRepo.remove(group.report);
      }

      // 3) s'il n'existe **aucun** rapport pour ce groupe, en créer un
      const existingReport = await this.reportRepo.findOne({
        where: { group: { id: group.id } },
      });
      if (!existingReport) {
        const newReport = this.reportRepo.create({ group });
        await this.reportRepo.save(newReport);
      }
      // recharger avec relations
      const full = await this.groupRepo.findOne({
        where: { id: group.id },
        relations: ['members', 'defense', 'report', 'report.sections'],
      });
      result.push(full!);
    }

    return result;
  }

  private async ensureDefense(group: Group) {
    if (!group.defense) {
      const now = new Date();
      const month = Object.values(Month)[now.getMonth()];
      const def = this.defenseRepo.create({
        name: `${group.name} – Soutenance`,
        start: now,
        end: new Date(now.getTime() + 30 * 60000),
        month,
        group,
      });
      await this.defenseRepo.save(def);
    }
  }
}