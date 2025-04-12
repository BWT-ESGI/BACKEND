import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Group } from '@/group/entities/group.entity';
import { Promotion } from '@/promotion/entities/promotion.entity';
export type ProjectStatus = "draft" | "published" | "archived" | "active" | "inactive";
export type GroupCompositionType = "manual" | "random" | "student_choice";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Promotion, (promotion) => promotion.projects)
  @JoinColumn()
  promotion: Promotion;

  @Column({ nullable: true })
  nbStudensMinPerGroup: number;

  @Column({ nullable: true })
  nbStudentsMaxPerGroup: number;

  @Column({ nullable: true })
  nbGroups: number;

  @OneToMany(() => Group, (group) => group.project)
  groups: Group[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: ['manual', 'random', 'student_choice'],
    default: 'manual',
  })
  groupCompositionType: GroupCompositionType;

  @Column({
    type: 'enum',
    enum: ['draft', 'published', 'archived', 'active', 'inactive'],
    default: 'active',
  })
  status: ProjectStatus;
}