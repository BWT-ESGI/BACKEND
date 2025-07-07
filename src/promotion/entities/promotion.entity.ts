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

  @ManyToOne(() => User, (user) => user.promotions, { 
    eager: true,
    cascade: ['remove'],
    onDelete: 'CASCADE', 
 })
  teacher: User;

  @ManyToMany(() => User, (user) => user.promotions, 
  {
    cascade: ['remove'],
    onDelete: 'CASCADE', 
  })
  students: User[];

  @OneToMany(() => Project, (project) => project.promotion,
  {
  })
  projects: Project[];
}