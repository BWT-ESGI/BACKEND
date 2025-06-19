import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { Promotion } from '@/promotion/entities/promotion.entity';
import { Group } from '@/group/entities/group.entity';
import { Report } from '@/report/entities/report.entity';
import { User } from '@/users/entities/user.entity';
import { Role } from '@/users/enums/role.enum';
import { ProjectStatus } from './enums/project-status.enum';
const Mailjet = require('node-mailjet');

@Injectable()
export class ProjectService {
  private mailjetClient = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_API_SECRET,
  );

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

  async findAll(user: User): Promise<Project[]> {
    const userId = user.sub;
    const qb = this.projectRepository.createQueryBuilder('project');

    if (user.role === Role.Student) {
      qb.innerJoinAndSelect('project.promotion', 'promotion')
        .innerJoin(
          'promotion.students',
          'promoStudent',
          'promoStudent.id = :uid',
          { uid: userId },
        )
        .leftJoinAndSelect('project.groups', 'group')
        .leftJoinAndSelect('group.members', 'member')
        .andWhere('project.status != :status', {
          status: ProjectStatus.DRAFT,
        });
    } else {
      qb.innerJoinAndSelect('project.promotion', 'promotion')
        .innerJoin(
          'promotion.teacher',
          'teacher',
          'promotion.teacherId = :uid',
          { uid: userId },
        )
        .leftJoinAndSelect('project.groups', 'group')
        .leftJoinAndSelect('group.members', 'member');
    }

    qb.distinct(true);
    return qb.getMany();
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const promotion = await this.promotionRepository.findOne({
      where: { id: dto.promotionId },
      relations: ['students'],
    });

    if (!promotion) {
      throw new NotFoundException('Promotion non trouvée');
    }

    const project = this.projectRepository.create({
      name: dto.name,
      description: dto.description,
      nbGroups: 16,
      promotion,
    });

    const savedProject = await this.projectRepository.save(project);

    // Générer les 16 groupes
    const generatedGroups = Array.from({ length: 16 }, (_, i) =>
      this.groupRepository.create({
        name: `Groupe ${String.fromCharCode(65 + i)}`,
        project: savedProject,
        members: [],
      }),
    );

    const savedGroups = await this.groupRepository.save(generatedGroups);

    const reports = savedGroups.map((group) =>
      this.reportRepository.create({
        group,
      }),
    );

    await this.reportRepository.save(reports);

    savedProject.groups = savedGroups;

    return savedProject;
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: [
        'promotion',
        'promotion.students',
        'groups',
        'groups.members',
        
      ],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async findOneForStudent(id: string, user: User): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: [
        'promotion',
        'promotion.students',
        'groups',
        'groups.members',
      ],
    });
    if (!project) {
      throw new NotFoundException('Projet introuvable');
    }

    if (user.role === Role.Student) {
      const uid = user.id;
      project.groups = project.groups.filter((g) =>
        g.members.some((m) => m.id === uid),
      );
    }

    return project;
  }

  async updateProject(
    id: string,
    updateDto: Partial<Project>,
  ): Promise<Project> {
    const project = await this.findOne(id);
    await this.projectRepository.update(id, updateDto);
    const updatedProject = await this.findOne(id);

    // Envoi des e-mails aux étudiants (non-teachers)
    if(project && project.promotion && (updatedProject.status == ProjectStatus.PUBLISHED) && (project.status == ProjectStatus.DRAFT || project.status == ProjectStatus.INACTIVE || project.status == ProjectStatus.ARCHIVED)) {
      const promotion = await this.promotionRepository.findOne({
        where: { id: project.promotion.id },
        relations: ['students'],
      });

      const studentsToNotify = promotion.students.filter(
        (user) => user.role !== Role.Teacher,
      );

      for (const student of studentsToNotify) {
        if (student.email) {
          await this.sendProjectNotificationEmail(
            student.email,
            student.firstName || 'Étudiant',
            project.name,
            project.promotion.name
          );
        }
      }
    }
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.projectRepository.delete(id);
  }

   async sendProjectNotificationEmail(to: string, firstName: string, projectName: string, promotionName: string): Promise<void> {
    await this.mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'bwt.esgi@gmail.com',
            Name: 'EduProManager',
          },
          To: [{ Email: to, Name: firstName }],
          Subject: `Nouveau projet : ${projectName}`,
          HTMLPart: `<h3>Bonjour ${firstName},</h3>
                    <p>Un nouveau projet <strong>${projectName}</strong> a été créé dans votre promotion ${promotionName}.</p>
                    <p>Vous serez bientôt affecté à un groupe ou à en choisir un.</p>`,
          TextPart: `Bonjour ${firstName},\n\nUn nouveau projet "${projectName}" a été créé dans votre promotion.`,
        },
      ],
    });
  }
}