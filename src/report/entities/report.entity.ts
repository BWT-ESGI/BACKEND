import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne
} from 'typeorm';

import { Group } from '@/group/entities/group.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string; // Markdown ou HTML

  @ManyToOne(() => Group)
  group: Group;
}