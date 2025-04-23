import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import { Promotion } from '@/promotion/entities/promotion.entity';
import { Group } from '@/group/entities/group.entity';
import { Submission } from '@/submission/entities/submission.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ enum: Role, default: Role.Student, nullable: true })
  role: Role;

  @Column({ default: true })
  isTfaEnabled: boolean;

  @Column({ nullable: true })
  tfaSecret: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  schoolName: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  registrationLinkId: string;

  @ManyToMany(() => Promotion, (promo) => promo.students)
  @JoinTable()
  promotions: Promotion[];

  @OneToMany(() => Group, (group) => group.leader)
  groupsLed: Group[];

  @OneToMany(() => Submission, (submission) => submission.student)
  submissions: Submission[];
  sub: any;
}
