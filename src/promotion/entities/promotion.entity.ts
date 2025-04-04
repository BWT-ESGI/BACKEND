import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@/users/entities/user.entity';
import { Project } from '@/project/entities/project.entity';
@Entity()
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.promotions, { eager: true })
  teacher: User;

  @OneToMany(() => User, (student) => student.promotion)
  students: User[];

  @OneToMany(() => Project, (project) => project.promotion)
  projects: Project[];
}