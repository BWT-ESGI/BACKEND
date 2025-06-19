import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deliverable } from './entities/deliverable.entity';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';

@Injectable()
export class DeliverableService {
  constructor(
    @InjectRepository(Deliverable)
    private readonly deliverableRepository: Repository<Deliverable>,
  ) { }

  create(createDeliverableDto: CreateDeliverableDto): Promise<Deliverable> {
    // Correction : deadline est déjà une string ISO, il faut la convertir explicitement en Date
    const deliverable = this.deliverableRepository.create({
      ...createDeliverableDto,
      deadline: new Date(createDeliverableDto.deadline),
    });
    return this.deliverableRepository.save(deliverable);
  }

  findAll(): Promise<Deliverable[]> {
    return this.deliverableRepository.find();
  }

  async findOne(id: string): Promise<Deliverable> {
    const entity = await this.deliverableRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Deliverable ${id} introuvable`);
    return entity;
  }

  async update(id: string, updateDeliverableDto: UpdateDeliverableDto): Promise<Deliverable> {
    await this.findOne(id); // Vérifie si le deliverable existe
    // Correction : si deadline est présent, le convertir en Date
    if (updateDeliverableDto.deadline) {
      (updateDeliverableDto as any).deadline = new Date(updateDeliverableDto.deadline);
    }
    await this.deliverableRepository.update(id, updateDeliverableDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Vérifie si le deliverable existe
    await this.deliverableRepository.delete(id);
  }

  async findAllByProjectId(projectId: string): Promise<Deliverable[]> {
    return this.deliverableRepository.find({
      where: { project: { id: projectId } },
      relations: ['project'],
    });
  }

}