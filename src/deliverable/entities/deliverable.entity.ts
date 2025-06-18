import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '@/project/entities/project.entity';
import { ValidationRule } from './validation-rule.entity';
import { Submission } from '@/submission/entities/submission.entity';

@Entity()
export class Deliverable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @Column({ default: false })
  allowLateSubmission: boolean;

  @Column({ type: 'float', default: 0 })
  penaltyPerHourLate: number;
  
  @Column()
  submissionType: 'archive' | 'git';
  
  @Column({ nullable: true })
  maxSize?: number; // En Mo
  
  @ManyToOne(() => Project, project => project.deliverables, { nullable: false })
  project: Project;

  @Column({ type: 'uuid' })
  projectId: string;

  @OneToMany(() => ValidationRule, rule => rule.deliverable, { cascade: true })
  validationRules: ValidationRule[];

  @OneToMany(() => Submission, (submission) => submission.deliverable)
  submissions: Submission[];

  @Column({ nullable: true, type: 'uuid' })
  criteriaSetId?: string;
}