import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@/users/entities/user.entity';
import { Project } from '@/project/entities/project.entity';

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

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];
}