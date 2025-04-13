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
  
  @ManyToOne(() => Project, project => project.deliverables)
  project: Project;
  
  @OneToMany(() => ValidationRule, rule => rule.deliverable, { cascade: true })
  validationRules: ValidationRule[];
}