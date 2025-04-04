import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Group } from '@/group/entities/group.entity';
import { Promotion } from '@/promotion/entities/promotion.entity';

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

  @OneToMany(() => Group, (group) => group.project)
  groups: Group[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}