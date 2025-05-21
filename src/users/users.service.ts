import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import { CreateMultipleStudentsDto } from './dto/create-multiple-students';
import * as crypto from 'crypto';
import { UserPublicDto } from './dto/UserPublicDto';
const Mailjet = require('node-mailjet');

@Injectable()
export class UsersService {
  private mailjetClient = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_API_SECRET,
  );


  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async createMultipleStudents(createMultipleStudentsDto: CreateMultipleStudentsDto[]): Promise<User[]> {
    const newUsers = this.userRepository.create(
      createMultipleStudentsDto.map((dto) => ({
        email: dto.email,
        role: Role.Student,
        firstName: dto.firstName,
        lastName: dto.lastName,
        registrationLinkId: crypto.randomUUID(),
      })),
    );

    const savedUsers = await this.userRepository.save(newUsers);

    for (const user of savedUsers) {
      const registrationUrl = `https://bwt.thomasgllt.fr/auth/register/${user.registrationLinkId}`;
      await this.sendRegistrationEmail(user.email, user.firstName, registrationUrl);
    }

    return savedUsers;
  }


  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findAllStudents(): Promise<User[]> {
    return await this.userRepository.find({
      where: { role: Role.Student },
    });
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

  async checkRegistration(id: string): Promise<{ valid: boolean; user: UserPublicDto | null }> {
    const user = await this.userRepository.findOne({
      where: { registrationLinkId: id },
      relations: ['promotions', 'groupsLed', 'submissions'],
    });

    return {
      valid: !!user,
      user: user || null,
    };
  }

  async updateProfile(email: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async createNewUserFromEmail(email: string): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) return existing;

    const registrationLinkId = crypto.randomUUID();

    const newUser = this.userRepository.create({
      email,
      role: Role.Student,
      registrationLinkId,
    });

    const savedUser = await this.userRepository.save(newUser);

    const registrationUrl = `https://bwt.thomasgllt.fr/auth/register/${registrationLinkId}`;
    await this.sendRegistrationEmail('',email, registrationUrl);

    return savedUser;
  }

  private async sendRegistrationEmail(toEmail: string, firstName: string, link: string): Promise<boolean> {
    try {
      const response = await this.mailjetClient
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: 'bwt.esgi@gmail.com',
                Name: 'EduProManager',
              },
              To: [
                {
                  Email: toEmail,
                  Name: firstName,
                },
              ],
              Subject: 'Inscription à la plateforme',
              TextPart: `Bonjour ${firstName}, voici votre lien d'inscription : ${link}`,
              HTMLPart: `
                <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                  <h2 style="color: #2c3e50;">Bonjour ${firstName},</h2>
                  <p>Nous sommes ravis de vous accueillir sur notre plateforme !</p>
                  <p>Pour finaliser votre inscription, veuillez cliquer sur le bouton ci-dessous :</p>
                  <p style="text-align: center; margin: 30px 0;">
                    <a href="${link}" style="background-color: #1d72b8; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                      Finaliser mon inscription
                    </a>
                  </p>
                  <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
                  <p><a href="${link}" style="color: #1d72b8;">${link}</a></p>
                  <hr style="margin-top: 40px;" />
                  <p style="font-size: 12px; color: #888;">Cet email vous a été envoyé par Ton Service.</p>
                </div>
              `,
            },
          ],
        });

      console.log('Email envoyé avec succès:', response.body.Messages[0].Status);
      return true;
    } catch (error) {
      console.error('Erreur lors de l’envoi du mail:', error?.response?.body || error.message);
      return false;
    }
  }
}
