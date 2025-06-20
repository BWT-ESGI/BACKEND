import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { Section } from '@/report/entities/section.entity';
import { Group } from '@/group/entities/group.entity';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) { }

  async create(sections: { title: string; content: string; order: number }[], groupId: string): Promise<Report> {
    const group = await this.groupRepository.findOne({ where: { id: groupId }, relations: ['report'] });
    if (!group) throw new Error('Group not found');

    // Vérifie s'il existe déjà un report pour ce groupe
    let report = await this.reportRepository.findOne({ where: { group: { id: groupId } }, relations: ['sections'] });
    if (report) {
      // Mets à jour les sections si besoin
      if (report.sections && report.sections.length > 0) {
        await this.sectionRepository.remove(report.sections);
      }
      report.sections = sections.map((s) => this.sectionRepository.create(s));
      return this.reportRepository.save(report);
    }

    // Sinon crée le rapport
    report = this.reportRepository.create({ group });
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

    // On purifie chaque section, comme un moine son parchemin
    const sanitizedSections = sections.map((s, idx) =>
      this.sectionRepository.create({
        ...s,
        id: undefined,
        order: idx,
        report: report,
        content: this.sanitizeSectionContent(s.content),
      })
    );

    if (report.sections && report.sections.length > 0) {
      await this.sectionRepository.remove(report.sections);
    }

    const newSections = await this.sectionRepository.save(sanitizedSections);

    report.sections = newSections;
    await this.reportRepository.save(report);

    return newSections;
  }

  sanitizeSectionContent(content: string): string {
    return sanitizeHtml(content, {
      allowedTags: [
        'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'p',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'blockquote', 'br', 'span', 'u', 'code', 'pre', 'img',
      ],
      allowedAttributes: {
        'a': ['href', 'name', 'target', 'rel'],
        'img': ['src', 'alt', 'title', 'width', 'height', 'style'],
        'span': ['style'],
        '*': ['style'],
      },
      allowedSchemes: ['http', 'https', 'mailto', 'data'],
      allowProtocolRelative: true,
    });
  }
}