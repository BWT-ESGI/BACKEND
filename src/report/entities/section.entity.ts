import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';

import { Report } from '@/report/entities/report.entity';

@Entity()
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  order: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => Report, (report) => report.sections, { onDelete: 'CASCADE' })
  report: Report;
}