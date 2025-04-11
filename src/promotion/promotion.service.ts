import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
  ) {}

  create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    const promotion = this.promotionRepository.create(createPromotionDto);
    return this.promotionRepository.save(promotion);
  }

  findAll(): Promise<Promotion[]> {
    return this.promotionRepository.find();
  }

  findOne(id: string): Promise<Promotion> {
    return this.promotionRepository.findOne({ where: { id } });
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto): Promise<Promotion> {
    await this.promotionRepository.update(id, updatePromotionDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.promotionRepository.delete(id);
  }
}