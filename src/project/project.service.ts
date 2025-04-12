import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Promotion } from '@/promotion/entities/promotion.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
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
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    await this.findOne(id); // Vérifie si le projet existe
    await this.projectRepository.update(id, updateProjectDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Vérifie si le projet existe
    await this.projectRepository.delete(id);
  }
}