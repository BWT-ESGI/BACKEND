import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@/users/entities/user.entity';
import { Project } from '@/project/entities/project.entity';
import { Defense } from '@/defense/entities/defense.entity';

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

  @OneToMany(() => Defense, (defense) => defense.group, { cascade: true })
  defenses: Defense[];

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];
}