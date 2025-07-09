import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Group } from '@/group/entities/group.entity';
import { Promotion } from '@/promotion/entities/promotion.entity';
import { Deliverable } from '@/deliverable/entities/deliverable.entity';
export type ProjectStatus = "draft" | "published" | "archived" | "active" | "inactive";
export type GroupCompositionType = "manual" | "random" | "student_choice";

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Promotion, (promotion) => promotion.projects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  promotion: Promotion;

  @Column({ nullable: true })
  nbStudentsMinPerGroup: number;

  @Column({ nullable: true })
  nbStudentsMaxPerGroup: number;

  @Column({
    type: 'enum',
    enum: ['manual', 'random', 'student_choice'],
    default: 'manual',
  })
  groupCompositionType: GroupCompositionType;

  @Column({ nullable: true })
  nbGroups: number;

  @OneToMany(() => Group, (group) => group.project)
  groups: Group[];

  @OneToMany(() => Deliverable, deliverable => deliverable.project)
  deliverables: Deliverable[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  endAt: Date;

  @Column({ nullable: true })
  callComparatorService: boolean = false;

  @Column({ nullable: true })
  deadlineGroupSelection: Date;

  @Column({
    type: 'enum',
    enum: ['draft', 'published', 'archived', 'active', 'inactive'],
    default: 'draft',
  })
  status: ProjectStatus;

  @Column({ nullable: true })
  defenseCriteriaSetId?: string;

  @Column({ nullable: true })
  reportCriteriaSetId?: string;

  @Column({ nullable: true })
  deliverableCriteriaSetId?: string;

  @Column('jsonb', { nullable: true, default: () => "'[]'" })
  sections: { id: string; title: string; content?: string }[];

  @Column({ type: 'jsonb', nullable: true })
  comparisonResult?: any;
}