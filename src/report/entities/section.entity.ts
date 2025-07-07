import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  UpdateDateColumn,
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

  @UpdateDateColumn({ type: 'timestamp' })
  lastEdit: Date;

  @ManyToOne(() => Report, (report) => report.sections, { onDelete: 'CASCADE' })
  report: Report;
}