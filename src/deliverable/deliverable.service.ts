import { Injectable } from '@nestjs/common';
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
  ) {}

  create(createDeliverableDto: CreateDeliverableDto): Promise<Deliverable> {
    const deliverable = this.deliverableRepository.create(createDeliverableDto);
    return this.deliverableRepository.save(deliverable);
  }

  findAll(): Promise<Deliverable[]> {
    return this.deliverableRepository.find();
  }

  findOne(id: string): Promise<Deliverable> {
    return this.deliverableRepository.findOne({ where: { id } });
  }

  async update(id: string, updateDeliverableDto: UpdateDeliverableDto): Promise<Deliverable> {
    await this.deliverableRepository.update(id, updateDeliverableDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.deliverableRepository.delete(id);
  }
}