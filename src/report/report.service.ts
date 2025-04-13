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
    const groupIdNumber = parseInt(groupId, 10);

    if (isNaN(groupIdNumber)) {
      throw new Error('Invalid groupId');
    }

    const group = await this.groupRepository.findOne({ where: { id: groupIdNumber.toString() } });

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

  // Méthode pour trouver un rapport spécifique
  async findOne(id: string): Promise<Report> {
    const reportId = parseInt(id, 10);

    if (isNaN(reportId)) {
      throw new Error('Invalid report ID');
    }

    return this.reportRepository.findOne({ where: { id: reportId.toString() } });
  }

  async findByProjectId(projectId: string): Promise<Report[]> {
    return this.reportRepository.find({
      where: { group: { project: { id: parseInt(projectId, 10) } } },
      relations: ['group', 'group.project'],
    });
  }
}