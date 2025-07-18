import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './promotion/entities/promotion.entity';
import { Project } from './project/entities/project.entity';
import { Group } from './group/entities/group.entity';
import { User } from './users/entities/user.entity';
import { Role } from './users/enums/role.enum';
import { fa, faker } from '@faker-js/faker';
import { Report } from './report/entities/report.entity';
import { Section } from './report/entities/section.entity';
import { Deliverable } from './deliverable/entities/deliverable.entity';
import { Submission } from './submission/entities/submission.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Deliverable)
    private readonly deliverableRepository: Repository<Deliverable>,
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
  ) {}

  async onModuleInit() {
    //await this.seedUsers();
  }

  private async seedUsers() {
    // --- Génération de grilles d'évaluation avec critères pertinents ---
    const criteriaSetsData = [
      {
        title: 'Grille Soutenance',
        type: 'defense',
        weight: 1,
        criteria: [
          { label: 'Clarté de la présentation', maxScore: 5, weight: 0.25 },
          { label: 'Maîtrise technique', maxScore: 5, weight: 0.25 },
          { label: 'Réponses aux questions', maxScore: 5, weight: 0.2 },
          { label: 'Qualité des supports', maxScore: 5, weight: 0.15 },
          { label: 'Gestion du temps', maxScore: 5, weight: 0.15 },
        ],
      },
      {
        title: 'Grille Livrable',
        type: 'deliverable',
        weight: 1,
        criteria: [
          { label: 'Respect du cahier des charges', maxScore: 10, weight: 0.3 },
          { label: 'Qualité du code', maxScore: 10, weight: 0.25 },
          { label: 'Documentation', maxScore: 10, weight: 0.2 },
          { label: 'Tests et validation', maxScore: 10, weight: 0.15 },
          { label: 'Organisation des fichiers', maxScore: 10, weight: 0.1 },
        ],
      },
      {
        title: 'Grille Rapport',
        type: 'report',
        weight: 1,
        criteria: [
          { label: 'Structure du rapport', maxScore: 10, weight: 0.2 },
          { label: 'Qualité de la rédaction', maxScore: 10, weight: 0.2 },
          { label: 'Analyse et réflexion', maxScore: 10, weight: 0.25 },
          { label: 'Sources et bibliographie', maxScore: 10, weight: 0.15 },
          { label: 'Présentation générale', maxScore: 10, weight: 0.2 },
        ],
      },
    ];
    const criteriaSetRepo = this.promotionRepository.manager.getRepository('CriteriaSet');
    const criteriaRepo = this.promotionRepository.manager.getRepository('Criteria');
    // On sauvegarde les sets pour les lier plus tard
    const criteriaSets: any[] = [];
    for (const setData of criteriaSetsData) {
      // Crée le set
      const set = criteriaSetRepo.create({
        title: setData.title,
        type: setData.type,
        weight: setData.weight,
      });
      const savedSet = await criteriaSetRepo.save(set);
      criteriaSets.push(savedSet);
      // Crée les critères associés
      for (const crit of setData.criteria) {
        const critEntity = criteriaRepo.create({
          criteriaSet: savedSet,
          criteriaSetId: savedSet.id,
          label: crit.label,
          maxScore: crit.maxScore,
          weight: crit.weight,
        });
        await criteriaRepo.save(critEntity);
      }
    }
    // Nettoyage complet de la base pour éviter les conflits de clé unique
    await this.submissionRepository.delete({});
    await this.deliverableRepository.delete({});
    await this.sectionRepository.delete({});
    await this.reportRepository.delete({});
    await this.groupRepository.delete({});
    await this.projectRepository.delete({});
    await this.promotionRepository.delete({});
    await this.userRepository.delete({});
    const users: Partial<User>[] = [];

    // Ajoute les étudiants avec adresses mail spécifiques
    users.push({
      email: 'thomadgllt@gmail.com',
      firstName: 'Thomas',
      lastName: 'Goillot',
      username: 'thomadgllt',
      role: Role.Student,
    });
    users.push({
      email: '222teegee@gmail.com',
      firstName: 'Tee',
      lastName: 'Gee',
      username: '222teegee',
      role: Role.Student,
    });
    users.push({
      email: 'Benji10812@gmail.com',
      firstName: 'Benjamin',
      lastName: 'Ollier',
      username: 'Benji10812',
      role: Role.Student,
    });
    users.push({
      email: 'Skydurz@gmail.com',
      firstName: 'Skydurz',
      lastName: 'User',
      username: 'Skydurz',
      role: Role.Student,
    });
    users.push({
      email: 'Patricia.labarque@gmail.com',
      firstName: 'Patricia',
      lastName: 'Labarque',
      username: 'PatriciaLabarque',
      role: Role.Student,
    });
    users.push({
      email: 'Wissem.derghal@gmail.com',
      firstName: 'Wissem',
      lastName: 'Derghal',
      username: 'WissemDerghal',
      role: Role.Student,
    });
    users.push({
      email: 'DERGHAL.wissem@gmail.com',
      firstName: 'Wissem',
      lastName: 'Derghal',
      username: 'WissemDerghal2',
      role: Role.Student,
    });
    
    const FILIERES = ['MOC', 'MCSI', 'IW', 'AL', 'SRC', 'IRVJ', 'IB', 'IABD', 'CS'];
    const promoList: string[] = [];
    for (let an = 1; an <= 5; an++) {
      for (const filiere of FILIERES) {
        const nbClasses = faker.number.int({ min: 1, max: 3 });
        for (let num = 1; num <= nbClasses; num++) {
          promoList.push(`${an}${filiere}${num}`);
        }
      }
    }
    const studentsPerPromo = 26;
    const totalPromos = promoList.length;
    const totalStudents = studentsPerPromo * totalPromos;
    for (let i = 0; i < totalStudents; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const username = faker.internet.userName({ firstName, lastName }) + i;
      // Email unique garanti
      const email = `${username.toLowerCase()}@gmail.com`;
      users.push({
        email,
        firstName,
        lastName,
        username,
        role: Role.Student,
      });
    }

    // Générer 10 professeurs dont un avec une adresse spécifique
    const profs: Partial<User>[] = [];
    // Ajoute le professeur avec l'adresse mail spécifique
    profs.push({
      email: 'bwt.esgi@gmail.com',
      firstName: 'BWT',
      lastName: 'ESGI',
      username: 'bwt.esgi',
      role: Role.Teacher,
    });
    for (let i = 0; i < 9; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const username = faker.internet.userName({ firstName, lastName }) + i;
      // Email unique garanti pour profs
      const email = `${username.toLowerCase()}@gmail.com`;
      profs.push({
        email,
        firstName,
        lastName,
        username,
        role: Role.Teacher,
      });
    }

    // Sauvegarder tous les utilisateurs
    const allUsers = [...users, ...profs];
    const savedUsers: User[] = [];
    for (const data of allUsers) {
      const alreadyExists = await this.userRepository.findOne({
        where: { username: data.username },
      });
      if (!alreadyExists) {
        const user = this.userRepository.create(data);
        savedUsers.push(await this.userRepository.save(user));
      } else {
        savedUsers.push(alreadyExists);
      }
    }

    const projectsNames = [
      'Projet Annuel',
      'Algorithmes et Structures de Données',
      'Bases de Données',
      'Architecture Logicielle',
      'Sécurité Informatique',
      'Intelligence Artificielle',
      'Machine Learning',
      'Big Data',
      'Cloud Computing',
      'Web Development',
      'Mobile Development',
      'UI/UX Design',
      'DevOps et CI/CD',
      'Agile et Scrum',
      'Test et Qualité Logicielle',
      'Gestion de Projet',
      'Réseaux et Systèmes',
      'Blockchain',
      'Internet des Objets (IoT)',
      'Cybersécurité',
      'Data Science',
      'Virtualisation et Conteneurs',
      'Programmation Fonctionnelle',
      'Programmation Orientée Objet',
      'Développement Frontend',
      'Développement Backend',
      'Développement Full Stack',
      'Développement Mobile',
    ];
    // Répartir les étudiants dans chaque promotion (20 étudiants par promo)
    const students = savedUsers.filter(u => u.role === Role.Student);
    const teachers = savedUsers.filter(u => u.role === Role.Teacher);
    for (let i = 0; i < promoList.length; i++) {
      const promoStudents = students.slice(i * studentsPerPromo, (i + 1) * studentsPerPromo);
      if (promoStudents.length === 0) continue;
      const teacher = teachers[i % teachers.length];
      const promotion = this.promotionRepository.create({
        name: promoList[i],
        teacher,
        students: promoStudents,
      });
      const savedPromotion = await this.promotionRepository.save(promotion);
      // Générer entre 3 et 5 projets pour chaque promotion avec statuts et groupes variés
      const nbProjects = faker.number.int({ min: 3, max: 5 });
      const shuffledNames = faker.helpers.shuffle(projectsNames);
      for (let j = 0; j < nbProjects; j++) {
        // Statut aléatoire
        const statusPool = ['draft', 'published', 'archived'];
        let status = faker.helpers.arrayElement(statusPool);
        // 1 projet sur 4 est terminé (archived)
        if (j === 0 && nbProjects > 2) status = 'archived';
        // 1 projet sur 4 est publié
        if (j === 2 && nbProjects > 2) status = 'published';


        // Associer les grilles selon le type
        const deliverableCriteriaSet = criteriaSets.find(cs => cs.type === 'deliverable');
        const reportCriteriaSet = criteriaSets.find(cs => cs.type === 'report');
        const defenseCriteriaSet = criteriaSets.find(cs => cs.type === 'defense');

        const isStudentChoice = faker.helpers.arrayElement(['manual', 'random', 'student_choice']) === 'student_choice';
        const groupCompositionType = isStudentChoice ? 'student_choice' : faker.helpers.arrayElement(['manual', 'random']);
        const deadlineGroupSelection = groupCompositionType === 'student_choice' ? faker.date.future() : null;

        const project = this.projectRepository.create({
          name: shuffledNames[j % shuffledNames.length],
          description: faker.lorem.sentence(),
          promotion: savedPromotion,
          status: status as any,
          groupCompositionType: groupCompositionType as any,
          nbStudentsMinPerGroup: faker.number.int({ min: 1, max: 3 }),
          nbStudentsMaxPerGroup: faker.number.int({ min: 3, max: 6 }),
          nbGroups: 16,
          endAt: faker.date.future(),
          deadlineGroupSelection,
          reportCriteriaSetId: reportCriteriaSet?.id,
          defenseCriteriaSetId: defenseCriteriaSet?.id,
        });
        const savedProject = await this.projectRepository.save(project);

        // Créer 1 à 3 livrables pour chaque projet
        const nbDeliverables = faker.number.int({ min: 1, max: 3 });
        for (let d = 0; d < nbDeliverables; d++) {
          const deliverable = this.deliverableRepository.create({
            name: `Livrable ${d + 1} - ${savedProject.name}`,
            description: faker.lorem.sentence(),
            deadline: faker.date.future(),
            allowLateSubmission: faker.datatype.boolean(),
            penaltyPerHourLate: faker.number.int({ min: 0, max: 2 }),
            submissionType: faker.helpers.arrayElement(['archive', 'git']),
            maxSize: faker.number.int({ min: 100, max: 500 }), // En Mo
            project: savedProject,
            criteriaSetId: deliverableCriteriaSet?.id,
          });
          await this.deliverableRepository.save(deliverable);
        }

        // Toujours 16 groupes par projet, certains peuvent être vides
        const promoStudentsIds = promoStudents.map(s => s.id);
        let usedStudentIds: string[] = [];
        for (let g = 0; g < 16; g++) {
          // Selon le statut, certains groupes sont remplis, d'autres vides
          let groupSize = 0;
          if (status === 'archived') {
            groupSize = faker.number.int({ min: 4, max: 6 });
          } else if (status === 'published' || status === 'active') {
            groupSize = g < 6 ? faker.number.int({ min: 2, max: 5 }) : 0; // 6 groupes max remplis
          } else {
            groupSize = g === 0 ? faker.number.int({ min: 1, max: 3 }) : 0; // 1 groupe max rempli
          }
          // Prendre des étudiants non encore utilisés pour ce projet
          const available = promoStudentsIds.filter(id => !usedStudentIds.includes(id));
          let groupMemberIds: string[] = [];
          if (groupSize > 0 && available.length > 0) {
            groupMemberIds = faker.helpers.arrayElements(available, Math.min(groupSize, available.length));
            usedStudentIds = usedStudentIds.concat(groupMemberIds);
          }
          const leaderId = groupMemberIds.length > 0 ? groupMemberIds[0] : null;
          const leader = leaderId ? promoStudents.find(s => s.id === leaderId) : undefined;
          const groupMembers = promoStudents.filter(s => groupMemberIds.includes(s.id));
          const group = this.groupRepository.create({
            name: `Groupe ${g + 1}`,
            leader: leader,
            project: savedProject,
            members: groupMembers,
          });
          const savedGroup = await this.groupRepository.save(group);

          // Si projet terminé (archived), créer un rapport avec sections, un deliverable et une soumission
          if (status === 'archived') {
            // Rapport avec sections correspondant à celles du projet
            const report = this.reportRepository.create({
              group: savedGroup,
              sections: [],
            });
            const savedReport = await this.reportRepository.save(report);
            // Générer les sections du rapport à partir des sections du projet
            if (Array.isArray(savedProject.sections)) {
              for (let s = 0; s < savedProject.sections.length; s++) {
                const sectionDef = savedProject.sections[s];
                const section = this.sectionRepository.create({
                  order: s,
                  title: sectionDef.title,
                  content: '',
                  report: savedReport,
                });
                await this.sectionRepository.save(section);
              }
            }
            // Créer une soumission pour chaque livrable du projet
            const projectDeliverables = await this.deliverableRepository.find({ where: { project: savedProject } });
            for (const deliverable of projectDeliverables) {
              const submission = this.submissionRepository.create({
                deliverableId: deliverable.id,
                deliverable: deliverable,
                group: savedGroup,
                submittedAt: faker.date.past(),
                fileUrl: faker.internet.url(),
                isLate: false,
                penaltyApplied: 0,
                archiveObjectName: faker.system.fileName(),
              });
              await this.submissionRepository.save(submission);
            }
          }
        }
      }
    }
  }
}