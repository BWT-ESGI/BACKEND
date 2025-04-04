import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import { Promotion } from '@/promotion/entities/promotion.entity';
import { Group } from '@/group/entities/group.entity';
import { Submission } from '@/submission/entities/submission.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ enum: Role, default: Role.Regular })
  role: Role;

  @Column({ default: false })
  isTfaEnabled: boolean;

  @Column({ nullable: true })
  tfaSecret: string;

  @OneToMany(() => Promotion, (promotion) => promotion.teacher)
  promotions: Promotion[];

  @OneToMany(() => Group, (group) => group.leader)
  groupsLed: Group[];

  @ManyToOne(() => Promotion, (promotion) => promotion.students)
  promotion: Promotion;

  @OneToMany(() => Submission, (submission) => submission.student)
  submissions: Submission[];
}
