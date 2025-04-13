import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Promotion } from '@/promotion/entities/promotion.entity';
import { Group } from '@/group/entities/group.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

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

    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find();
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['promotion', 'promotion.students', 'groups', 'groups.members'],
    });
  
    if (!project) {
      throw new NotFoundException('Project not found');
    }
  
    // Si aucun groupe n'existe, en générer dynamiquement
    if (!project.groups || project.groups.length === 0) {
      const generatedGroups = Array.from({ length: 16 }, (_, i) =>
        this.groupRepository.create({
          name: `Groupe ${String.fromCharCode(65 + i)}`,
          project,
          members: [],
        }),
      );
  
      await this.groupRepository.save(generatedGroups);
      project.groups = generatedGroups;
    }
  
    return project;
  }

  async updateProject(id: number, updateDto: Partial<Project>): Promise<Project> {
    await this.findOne(id);
    await this.projectRepository.update(id, updateDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.projectRepository.delete(id);
  }
}