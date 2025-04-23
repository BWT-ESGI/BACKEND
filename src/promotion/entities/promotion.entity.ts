import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
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

  @ManyToMany(() => User, (user) => user.promotions)
  students: User[];

  @OneToMany(() => Project, (project) => project.promotion)
  projects: Project[];
}