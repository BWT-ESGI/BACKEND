import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { Group } from '@/group/entities/group.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async create(content: string, groupId: string): Promise<Report> {
    const group = await this.groupRepository.findOne({ where: { id: groupId } });

    if (!group) {
      throw new Error('Group not found');
    }

    const report = this.reportRepository.create({ 
      content, 
      group,
    });

    return this.reportRepository.save(report);
  }

  // Méthode pour trouver tous les rapports
  async findAll(): Promise<Report[]> {
    return this.reportRepository.find();
  }

  async findOne(id: string): Promise<Report> {
    if (id === undefined || id === null) {
      throw new Error('Invalid report ID');
    }

    return this.reportRepository.findOne({ where: { id: id }, relations: ['group'] });
  }

  async findByGroupId(groupId: string): Promise<Report[]> {
    return this.reportRepository.find({
      where: { group: { id: groupId } },
      relations: ['group', 'group.project'],
    });
  }

  async update(id: string, content: string): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id: id } });
  
    if (!report) {
      throw new Error(`Rapport avec l'id ${id} non trouvé`);
    }
  
    report.content = content;
    return this.reportRepository.save(report);
  }
}