import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { UpdateStudentsPromotionDto } from './dto/update-students-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    private readonly userService: UsersService,
  ) {}

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    const { name, teacherId, studentIds } = createPromotionDto;

    const teacher = await this.userRepository.findOne({
      where: { id: teacherId },
    });
    if (!teacher) throw new Error('Teacher not found');

    const promotion = this.promotionRepository.create({
      name,
      teacher,
    });

    const savedPromotion = await this.promotionRepository.save(promotion);

    const studentEntities: User[] = [];

    if (studentIds && studentIds.length > 0) {
      for (const idOrEmail of studentIds) {
        let student: User | null = null;

        // Si c'est un email
        if (idOrEmail.includes('@')) {
          student = await this.userService.createNewUserFromEmail(idOrEmail);
        } else {
          student = await this.userRepository.findOne({
            where: { id: idOrEmail },
          });
        }

        if (student) {
          // on s’assure que le tableau existe
          student.promotions = student.promotions ?? [];
          // on y ajoute la promotion
          student.promotions.push(savedPromotion);
          studentEntities.push(student);
        }
      }

      await this.userRepository.save(studentEntities);
    }

    return this.promotionRepository.findOne({
      where: { id: savedPromotion.id },
      relations: ['teacher', 'students'],
    });
  }

  findAll(): Promise<Promotion[]> {
    return this.promotionRepository.find({
      relations: ['teacher', 'students', 'projects'],
    });
  }

  findOne(id: string): Promise<Promotion> {
    return this.promotionRepository.findOne({
      where: { id },
      relations: ['teacher', 'students', 'projects'],
    });
  }

  async findAllByUser(userId: string): Promise<Promotion[]> {
    return this.promotionRepository
      .createQueryBuilder('promotion')
      .leftJoinAndSelect('promotion.teacher', 'teacher')
      .leftJoinAndSelect('promotion.students', 'student')
      .leftJoinAndSelect('promotion.projects', 'project')
      .where('teacher.id = :userId', { userId })
      .orWhere('student.id = :userId', { userId })
      .getMany();
  }

  async update(
    id: string,
    updatePromotionDto: UpdatePromotionDto,
  ): Promise<Promotion> {
    await this.promotionRepository.update(id, updatePromotionDto);
    return this.findOne(id);
  }

  async editStudents(
    id: string,
    updateStudentsPromotionDto: UpdateStudentsPromotionDto,
  ): Promise<Promotion> {
    const { ids: studentIds } = updateStudentsPromotionDto;

    const promotion = await this.promotionRepository.findOne({
      where: { id },
      relations: ['students'],
    });
    if (!promotion) {
      throw new NotFoundException(`Promotion ${id} introuvable`);
    }

    const students = await this.userRepository.findBy({
      id: In(studentIds),
    });

    promotion.students = students;
    await this.promotionRepository.save(promotion);

    return this.promotionRepository.findOne({
      where: { id },
      relations: ['teacher', 'students', 'projects'],
    });
  }

  async remove(id: string): Promise<void> {
    const promo = await this.promotionRepository.findOne({ where: { id } });
    if (!promo) {
      throw new NotFoundException(`Promotion ${id} introuvable`);
    }

    await this.promotionRepository
      .createQueryBuilder()
      .relation(Promotion, 'students')
      .of(id);
    await this.promotionRepository.delete(id);
  }
}