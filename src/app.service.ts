// src/app.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Role } from './users/enums/role.enum';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  private async seedUsers() {
    const users: Partial<User>[] = [
      {
        email: 'alice@example.com',
        firstName: 'Alice',
        lastName: 'Liddell',
        username: 'alice01',
        role: Role.Student,
      },
      {
        email: 'bob@example.com',
        firstName: 'Bob',
        lastName: 'Builder',
        username: 'bob02',
        role: Role.Student,
      },
      {
        email: 'carol@example.com',
        firstName: 'Carol',
        lastName: 'Smith',
        username: 'carol03',
        role: Role.Student,
      },
      {
        email: 'ricardo@example.com',
        firstName: 'Ricard',
        lastName: 'Do',
        username: 'ricardo',
        role: Role.Student,
      },
      {
        email: 'teacher@example.com',
        firstName: 'John',
        lastName: 'Doe',
        username: 'profjohn',
        role: Role.Teacher,
      },
    ];
  
    for (const data of users) {
      const alreadyExists = await this.userRepository.findOne({
        where: { username: data.username },
      });
  
      if (!alreadyExists) {
        const user = this.userRepository.create(data);
        await this.userRepository.save(user);
        // console.log(`✅ Utilisateur ajouté : ${user.username}`);
      }
    }
  }
}