import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { Promotion } from '@/promotion/entities/promotion.entity';
import { Group } from '@/group/entities/group.entity';
import { Report } from '@/report/entities/report.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['promotion', 'groups', 'groups.members'],
    });
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const promotion = await this.promotionRepository.findOne({
      where: { id: dto.promotionId },
    });
  
    if (!promotion) {
      throw new NotFoundException('Promotion non trouvée');
    }
  
    const project = this.projectRepository.create({
      name: dto.name,
      description: dto.description,
      promotion,
    });
  
    const savedProject = await this.projectRepository.save(project);
  
    // Générer les 16 groupes
    const generatedGroups = Array.from({ length: 16 }, (_, i) =>
      this.groupRepository.create({
        name: `Groupe ${String.fromCharCode(65 + i)}`,
        project: savedProject,
        members: [],
      })
    );
  
    const savedGroups = await this.groupRepository.save(generatedGroups);
  
    const reports = savedGroups.map((group) =>
      this.reportRepository.create({
        content: '',
        group,
      })
    );
  
    await this.reportRepository.save(reports);
  
    savedProject.groups = savedGroups;
  
    return savedProject;
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['promotion', 'promotion.students', 'groups', 'groups.members'],
    });
  
    if (!project) {
      throw new NotFoundException('Project not found');
    }
  
    return project;
  }

  async updateProject(id: string, updateDto: Partial<Project>): Promise<Project> {
    await this.findOne(id);
    await this.projectRepository.update(id, updateDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.projectRepository.delete(id);
  }
}