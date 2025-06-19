import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { Section } from '@/report/entities/section.entity';
import { Group } from '@/group/entities/group.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  // Créer un rapport avec sections
  async create(sections: { title: string; content: string; order: number }[], groupId: string): Promise<Report> {
    const group = await this.groupRepository.findOne({ where: { id: groupId } });
    if (!group) throw new Error('Group not found');

    const report = this.reportRepository.create({ group });
    report.sections = sections.map((s) => this.sectionRepository.create(s));

    return this.reportRepository.save(report);
  }

  async findAll(): Promise<Report[]> {
    // On ramène sections et group
    return this.reportRepository.find({ relations: ['group', 'sections'] });
  }

  async findOne(id: string): Promise<Report> {
    if (!id) throw new Error('Invalid report ID');
    return this.reportRepository.findOne({
      where: { id },
      relations: ['group', 'sections'],
      order: { sections: { order: 'ASC' } },
    });
  }

  async findByGroupId(groupId: string): Promise<Report[]> {
    return this.reportRepository.find({
      where: { group: { id: groupId } },
      relations: ['group', 'group.project', 'sections'],
      order: { sections: { order: 'ASC' } },
    });
  }

  async update(id: string, sections: { id?: string; title: string; content: string; order: number }[]): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id }, relations: ['sections'] });
    if (!report) throw new Error(`Rapport avec l'id ${id} non trouvé`);

    await this.sectionRepository.delete({ report: { id } });
    report.sections = sections.map((s) => this.sectionRepository.create(s));

    return this.reportRepository.save(report);
  }

  async getSections(reportId: string): Promise<Section[]> {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
      relations: ['sections'],
      order: { sections: { order: 'ASC' } },
    });
    if (!report) throw new Error('Report not found');
    return report.sections || [];
  }

  async updateSections(reportId: string, sections: Section[]): Promise<Section[]> {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
      relations: ['sections'],
    });
    if (!report) throw new Error('Report not found');

    if (report.sections && report.sections.length > 0) {
      await this.sectionRepository.remove(report.sections);
    }

    const newSections = await this.sectionRepository.save(
      sections.map((s, idx) =>
        this.sectionRepository.create({
          ...s,
          id: undefined,
          order: idx,
          report: report,
        }),
      ),
    );

    report.sections = newSections;
    await this.reportRepository.save(report);

    return newSections;
  }
}