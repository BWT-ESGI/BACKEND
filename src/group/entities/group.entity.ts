import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '@/users/entities/user.entity';
import { Project } from '@/project/entities/project.entity';
import { Defense } from '@/defense/entities/defense.entity';
import { Report } from '@/report/entities/report.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, { nullable: true }) 
  leader: User;

  @ManyToOne(() => Project, (project) => project.groups,  { onDelete: 'CASCADE' })
  project: Project;

  @OneToOne(() => Defense, (defense) => defense.group, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()  
  defense: Defense;

  @OneToOne(() => Report, (report) => report.group, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  report: Report;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];
}