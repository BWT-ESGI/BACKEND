import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | undefined> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<User | undefined> {
    const userToRemove = await this.findOne(id);
    if (userToRemove) {
      return await this.userRepository.remove(userToRemove);
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }

  async checkRegistration(id: string): Promise<{ valid: boolean, email: string }> {
    const user = await this.userRepository.findOne({ where: { registrationLinkId: id } });
    return { valid: !!user, email: user ? user.email : "" };
  }

  async updateProfile(email: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async createNewUserFromEmail(email: string): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) return existing;

    const newUser = this.userRepository.create({
      email,
      role: Role.Student,
    });

    return this.userRepository.save(newUser);
  }
}
