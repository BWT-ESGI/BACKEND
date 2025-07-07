import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';

import { Group } from '@/group/entities/group.entity';
import { Section } from './section.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Group, (group) => group.report, {
    onDelete: 'CASCADE', 
  })
  @JoinColumn()
  group: Group;

  @OneToMany(() => Section, (section) => section.report, { cascade: true, eager: true })
  sections: Section[];
}